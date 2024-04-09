import { MonnaServer } from "../mod.ts";


const m = new MonnaServer(8080, 1);

m.methods.add("echo", async (...args) => args);
m.methods.add("token", async () => m.createJWT({user: "haxi"}));
m.methods.addSec("secret", async (payload) => "I love you, " + payload.user + "!");
m.methods.add("log", async (arg) => console.log("LOG", arg));
m.methods.addSec("logSec", async (payload, arg) => console.log("SEC LOG", payload, arg));

await m.serve();