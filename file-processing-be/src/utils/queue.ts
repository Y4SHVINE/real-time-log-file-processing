import { Queue } from "bullmq";
import Redis from "ioredis";
import { config } from "../constants/config";

export const redis = new Redis({
    host: config.redisHost,
    port: config.redisPort,
    maxRetriesPerRequest: null,
});

export const logQueue = new Queue(config.bullMQQueue, { connection: redis });