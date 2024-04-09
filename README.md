# Monna Server

## What is that?
* This is `Monna Server`. Server with `MonnaRPC` support
* It allows you to create online games based on `Monna Histea Engine`

## How it works?
* Refer to [Monna RPC documentation](doc/MonnaRPC.md)

## Usage
* Download and install `Deno`
* Create your game as here:
```ts
// Import last version (NOT SAFE)
import { MonnaServer } from "https://raw.githubusercontent.com/AldieNightStar/MonnaServer/main/mod.ts"

// Create new Server
const m = new MonnaServer(8080, 1);

// Add couple of methods
m.methods.add("echo", async (...args) => args);
m.methods.add("log", async (arg) => console.log("LOG", arg));

// This method creates FREE jwt tokens with payload {user: "haxi"}
m.methods.add("token", async () => m.createJWT({user: "haxi"}));

// Add secured methods (Token Required)
// First arg will always be JWT payload
m.methods.addSec("secret", async (payload) => "I love you, " + payload.user + "!");
m.methods.addSec("logSec", async (payload, arg) => console.log("SEC LOG", payload, arg));


// Start the server
await m.serve();
```

