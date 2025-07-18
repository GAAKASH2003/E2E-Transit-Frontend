// lib/sync-supabase-user.ts
import type { User } from "@supabase/supabase-js";
import { supabaseClientServer } from "@/utils/supabase/server";

export async function syncSupabaseUser(supabaseUser: User) {
  const supabase = await supabaseClientServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("No active session found. Please sign in first.");
  }

  const token = session?.access_token;
  if (!token) {
    throw new Error("No access token. Please sign in first.");
  }

  const identity = session?.user?.identities?.[0];

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/syncuser`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: session?.user.id,
        email: session?.user.email,
        provider: identity?.provider || "email",
        provider_id: identity?.id || null,
      }),
    }
  );

  if (!response.ok) {
    console.error("Failed to sync user:", response.statusText);
    throw new Error("Failed to sync user");
  }
  const data = await response.json();
  console.log("User synced successfully:", data);

  return data;
}
