import { MonnaServer } from "../mod.ts";


const m = new MonnaServer(8080);

m.methods.add("echo", async (...args) => args);
m.methods.add("token", async () => m.createJWT({user: "haxi"}));
m.methods.addSec("secret", async (payload) => "I love you, " + payload.user + "!");

await m.serve();