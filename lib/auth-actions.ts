"use server";

import { redirect } from "next/navigation";
import { supabaseClientServer } from "@/utils/supabase/server";

export async function signInWithGoogle() {
  const supabase = await supabaseClientServer();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/callback`,
    },
  });
  if (data.url) {
    redirect(data.url);
  }
  if (error) {
    console.error("Error signing in with Google:", error);
    throw new Error("Failed to sign in with Google");
  }
  return data;
}
