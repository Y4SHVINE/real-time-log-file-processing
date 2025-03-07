export const config = {
    trackingKeys : process.env.TRACKING_KEYS?.split(",") || [],
    trackingIps : process.env.TRACKING_IPS?.split(",") || []
}

