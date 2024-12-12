import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";

const app = express();
const port = 3001;

app.get("/", (req, res) => {
  res.send("Websocket server is running");
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const players: Map<string, { x: number; y: number }> = new Map();

wss.on("connection", (ws) => {
  const playerId = `Player_${Date.now()}`;
  players.set(playerId, { x: 400, y: 300 });

  console.log(`Player connected: ${playerId}`);
  ws.send(
    JSON.stringify({
      type: "init",
      playerId,
      players: Array.from(players.entries()),
    })
  );

  ws.on("message", async (message) => {
    const data = JSON.parse(message.toString());
    if (data.type === "move") {
      players.set(data.playerId, { x: data.x, y: data.y });

      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === ws.OPEN) {
          client.send(
            JSON.stringify({
              type: "update",
              playerId: data.playerId,
              x: data.x,
              y: data.y,
            })
          );
        }
      });
    }
  });

  ws.on("close", () => {
    console.log(`Player disconnected ${playerId}`);
    players.delete(playerId);
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify({ type: "disconnect", playerId }));
      }
    });
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
