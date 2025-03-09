import express from "express";
import multer from "multer";
import cors from "cors";
import { logQueue } from "./src/utils/queue";
import { authenticate } from "./src/middlewares/authMiddleware";
import { config } from "./src/constants/config";
import { supabase } from "./src/utils/supabase";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.post(
  "/api/upload-logs",
  authenticate,
  upload.single("file"),
  async (req: any, res: any) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const job = await logQueue.add("process-log", {
      filePath: req.file.path,
      fileId: req.file.filename,
      originalname: req.file.originalname,
    });
    res.json({ jobId: job.id });
  }
);

app.get("/api/stats", authenticate, async (req: any, res: any) => {
  console.log("================test")
  const { data, error } = await supabase.from("log_stats").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/stats/:jobId", authenticate, async (req: any, res: any) => {
  const { jobId } = req.params;
  const { data, error } = await supabase
    .from("log_stats")
    .select("*")
    .eq("file_id", jobId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(
    data.length ? data[0] : { message: "No stats found for this jobId" }
  );
});

app.get("/api/queue-status", authenticate, async (req, res) => {
  const waiting = await logQueue.getWaitingCount();
  const active = await logQueue.getActiveCount();
  const completed = await logQueue.getCompletedCount();
  const failed = await logQueue.getFailedCount();

  res.json({ waiting, active, completed, failed });
});

app.listen(config.PORT, () =>
  console.log(`Backend server running on port ${config.PORT}`)
);

export { app };