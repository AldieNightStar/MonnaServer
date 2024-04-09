import { create as createJWT  } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { KEY, sendError } from "./util.ts";
import { Methods } from "./methods.ts";

export class MonnaServer {
    private server: Deno.HttpServer | null = null
    
    constructor(
        public port: number,
        public tokenTimeMin: number = 60,
        public methods: Methods = new Methods(tokenTimeMin),
    ) {}

    async stop() {
        await this.server?.shutdown()
        this.server = null;
    }

    async createJWT(payload: {}) {
        const iat = Math.floor(Date.now());
        return await createJWT({ alg: "HS512", typ: "JWT" }, {...payload, iat}, KEY);
    }

    async serve() {
        // Stop previous
        if (this.server != null) await this.stop();

        // Run new
        this.server = Deno.serve({port: this.port}, (req) => {
            // Verify headers support that
            if (req.headers.get("upgrade") != "websocket") {
                return new Response(null, { status: 501 });
            }

            // Token from `jwt` parameter
            const jwt = new URL(req.url).searchParams.get('jwt');
        
            // Create websocket
            const { socket, response } = Deno.upgradeWebSocket(req);
        
            // Add message event listener
            socket.addEventListener("message", async (event) => {

                // Prase json
                const dat = JSON.parse(event.data)
                
                // Ignore messages with no id
                if (dat.id === undefined || dat.id === null) return;

                // Check name is present
                if (typeof dat.name !== "string") {
                    return sendError(socket, dat.id, "No name of the method to run");
                }

                // Type should be MonnaRPC
                if (dat.type !== "MonnaRPC") {
                    return sendError(socket, dat.id, "Wrong type. 'MonnaRPC' required");
                }

                // Message should have "params" as Array
                if (!Array.isArray(dat.params)) {
                    return sendError(socket, dat.id, "Params should be Array");
                }

                // Check that this is notificaition
                const isNotification = dat.noreturn === true;

                // Execute Monna methods
                try {
                    const response = await this.methods.exec(dat.name, dat.params, jwt);
                    if (!isNotification) socket.send(JSON.stringify({id: dat.id, result: response, type: "MonnaRPC"}));
                    return;
                } catch (e) {
                    if (e instanceof Error) {
                        return sendError(socket, dat.id, e.message)
                    } else {
                        return sendError(socket, dat.id, "Unknown error type: " + e);
                    }
                }
            });
        
            // Return response
            return response;
        });
    }
}

