export const config = {
    supabaseUrl : process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    supabasePublicKey:process.env.NEXT_PUBLIC_SUPABASE_KEY || "",
    webSocketUrl: process.env.NEXT_PUBLIC_WEB_SOCKET_URL || "",
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
}