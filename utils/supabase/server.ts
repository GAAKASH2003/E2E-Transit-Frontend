import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
// import { DotenvConfigOptions } from 'dotenv'
// import { config as dotenvConfig } from "dotenv";
// dotenvConfig();
export async function supabaseClientServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            console.log("setting cookies");
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (err) {
            console.error("Failed to set cookies:", err);
          }
        },
      },
    }
  );
}
