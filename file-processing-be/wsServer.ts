import { WebSocketServer, WebSocket } from "ws";
import { config } from "./src/constants/config";

const wss = new WebSocketServer({ port: config.wsPort });
const clients = new Set<WebSocket>();

wss.on("connection", (ws) => {
  console.log("New WebSocket connection created");
  clients.add(ws);

  ws.on("message", (data) => {
    const message = data.toString();
    console.log("Broadcasting the message : ", message);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("WebSocket connection closed");
  });
});

console.log(`WebSocket server running on port ${config.wsPort}`);
