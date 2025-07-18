import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { syncSupabaseUser } from "@/lib/syncUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    console.error("OAuth callback missing `code`.");
    return NextResponse.redirect(
      new URL("/error?message=No+code+provided", url)
    );
  }

  // Use explicit site URL so prod works reliably
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_SITE_LOCAL!
      : process.env.NEXT_PUBLIC_SITE_URL!;

  const redirectUrl = new URL("/profile", baseUrl);
  const response = NextResponse.redirect(redirectUrl);

  // Supabase SSR client wired to request & response for cookie persistence
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll().map((c) => ({
            name: c.name,
            value: c.value,
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  // Exchange the OAuth code for a Supabase session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("exchangeCodeForSession error:", error);
    return NextResponse.redirect(
      new URL("/error?message=Auth+failed", baseUrl)
    );
  }

  // Optional: sync user to your own backend
  const user = data?.user;
  if (user) {
    try {
      await syncSupabaseUser(user); // ensure this uses a backend API call if needed
    } catch (err) {
      console.error("syncSupabaseUser error (non-fatal):", err);
      // Don't block redirect
    }
  }

  return response;
}
