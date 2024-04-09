import { Method, MethodSecured } from "./common.ts";
import { KEY } from "./util.ts";
import { verify as verifyJWT  } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

export class Methods {
    private methods: {[key: string]: Method} = {}
    private secured: string[] = [];

    constructor(private tokenTimeMin: number) {}

    all() {
        return Object.keys(this.methods);
    }

    add(name: string, method: Method) {
        this.methods[name] = method;
    }
    
    addSec(name: string, method: MethodSecured) {
        this.methods[name] = method;
        this.secured.push(name);
    }

    async exec(name: string, args: any[], token: string | null) {
        const method = this.methods[name];
        if (!method) throw new Error("No method: " + name);
        if (this.isSecured(name)) {
            try {
                if (!token) throw new Error("Auth failed. No token");
                const payload = await verifyJWT(token, KEY);
                if (!payload.iat || this.isExpired(payload.iat)) {
                    throw new Error("Auth failed. Token expired");
                }
                return await method(payload, ...args);
            } catch(e) {
                if (e instanceof Error && e.message.indexOf("signature does not match") !== -1) {
                    throw new Error("Auth failed. " + e.message);
                } else {
                    throw e;
                }
            }
        } else {
            return await method(...args);
        }
    }

    isSecured(name: string) {
        return this.secured.filter(n => n == name).length > 0;
    }

    private isExpired(iat: number): boolean {
        const difference = Date.now() - iat;
        const maxTimeMs = this.tokenTimeMin * 60 * 1000;
        return difference > maxTimeMs
    }
}