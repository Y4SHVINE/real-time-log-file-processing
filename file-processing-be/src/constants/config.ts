export const config = {
  PORT: Number(process.env.PORT) || 3001,
  wsPort: Number(process.env.WS_PORT) || 3002,
  trackingKeys: process.env.TRACKING_KEYS?.split(",") || [],
  trackingIps: process.env.TRACKING_IPS?.split(",") || [],
  bullMQQueue: process.env.BULLMQ_QUEUE || "",
  redisHost: process.env.REDIS_HOST || "",
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseJWTSecret: process.env.SUPABASE_JWT_SECRET || "",
  supabaseKey: process.env.SUPABASE_KEY || "",
};
