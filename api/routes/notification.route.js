// routes/notification.route.js
import express from "express";
import Notification from "../models/notification.model.js";

const router = express.Router();

// store connected clients
let clients = [];

// SSE endpoint
router.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // push client into memory
  clients.push(res);

  // remove client on disconnect
  req.on("close", () => {
    clients = clients.filter((c) => c !== res);
  });
});

// function to send notification to all connected clients
export const sendSSE = (data) => {
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

export default router;
