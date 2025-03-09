import { Worker, Job } from "bullmq";
import WebSocket from "ws";
import { config } from "./src/constants/config";
import { redis } from "./src/utils/queue";
import { processLogFile } from "./src/utils/logProcessor";

const ws = new WebSocket("ws://localhost:3002");

ws.on("open", () => {
  console.log("Worker connected to WebSocket server");
});

ws.on("error", (err) => {
  console.error("Worker WebSocket error:", err);
});

const worker = new Worker(
  config.BullMQQueue,
  async (job: Job) => {
    console.log("Worker Started for new Job");
    const { filePath, fileId } = job.data;
    const data = await processLogFile(filePath, fileId);
    if (ws.readyState === WebSocket.OPEN && data) ws.send(JSON.stringify(data));
  },
  { connection: redis, concurrency: 4 }
);
