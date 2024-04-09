export const KEY = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
);

export function sendError(socket: WebSocket, id: string, message: string) {
    socket.send(JSON.stringify({id, error: message, type: "MonnaRPC"}));
}