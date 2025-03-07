import { Queue } from "bullmq";
import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null,
});

export const logQueue = new Queue("log-processing-queue", { connection: redis });