"use server";

import { redirect } from "next/navigation";
import { supabaseClientServer } from "@/utils/supabase/server";

export async function signInWithGoogle() {
  const redirectUrl =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_SITE_LOCAL
      : process.env.NEXT_PUBLIC_SITE_URL;

  const supabase = await supabaseClientServer();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: `${redirectUrl}/auth/callback`,
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("User data: ", user);
  console.log("OAuth data: ", data);
  if (error || !data.url) {
    console.error("OAuth sign-in error: ", error?.message);
    redirect(`/error?message=Invalid credentials`);
  }

  redirect(data.url);
}
