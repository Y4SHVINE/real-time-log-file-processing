import { Worker, Job } from "bullmq";
import Redis from "ioredis";
import fs from "fs";
import readline from "readline";
import { createClient } from "@supabase/supabase-js";
import { config } from "./src/constants/config";

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null,
});
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

const uploadFileToStorage = async (job: Job) => {
    const { filePath, originalname } = job.data;
    const fileBuffer = fs.readFileSync(filePath);
    const { error } = await supabase.storage
        .from("log_files")
        .upload(`${originalname}`, fileBuffer, {
            contentType: "text/plain",
            upsert: true,
        });

    if (error) {
        console.error("Error uploading file to Supabase: ", error.message);
        return;
    }
}

const worker = new Worker("log-processing-queue", async (job: Job) => {
    console.log("=============Worker Started==============");
    const { filePath } = job.data;
    const stream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    let errorCounts: Record<string, number> = {};
    const keys = [...config.trackingKeys, ...config.trackingIps];

    for await (const line of rl) {
        keys.forEach(key => {
            if(!errorCounts[key])
                errorCounts[key] = 0;
            if (line.includes(key)) {
                errorCounts[key]++;
            }
        });
    }

    const { error } = await supabase.from("log_stats").insert({ log_stats: errorCounts });
    if (error) {
        console.error("Error inserting logs:", error);
    } else {
        // await uploadFileToStorage(job);
    }
}, { connection: redis, concurrency: 4 });