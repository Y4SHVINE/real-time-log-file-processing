import express from "express";
import multer from "multer";
import cors from "cors";
import { logQueue } from "./src/utils/queue";

const app = express();
const upload = multer({ dest: "uploads/" });

// Enable CORS
app.use(cors({ origin: "http://localhost:3000" }));

app.post("/api/upload-logs", upload.single("file"), async (req: any, res: any) => {
    console.log("req.file.path : ", req.file.path);
    console.log("req.file.originalname : ", req.file.originalname);
    if (!req.file)
        return res.status(400).json({ error: "No file uploaded" });
    const job = await logQueue.add("process-log", { filePath: req.file.path, fileId: req.file.filename, originalname: req.file.originalname });
    res.json({ jobId: job.id });
});

app.get("/", async (req: any, res: any) => {
    console.log("=============Backend Server Works==============")
    res.json("Backend server works!");
});


app.listen(3001, () => console.log("Backend running on port 3001"));

