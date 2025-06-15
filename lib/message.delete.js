sock.ev.on('messages.delete', async (msg) => {
await anti.handleAntiDelete(sock, msg);
});