import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  // Create redirect URL to /profile and append code as a query parameter
  const redirectUrl = new URL("/profile", req.url);
  if (code) {
    redirectUrl.searchParams.set("code", code);
  }

  // Prepare a response object for setting cookies
  const response = NextResponse.redirect(redirectUrl);

  if (!code) {
    console.error("No code provided in the request");
    return NextResponse.redirect(
      new URL("/error?message=No+code+provided", req.url)
    );
  }

  // Create Supabase SSR client
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

  // Exchange code for a session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("exchangeCodeForSession error:", error);
    return NextResponse.redirect(
      new URL("/error?message=Auth+failed", req.url)
    );
  }

  // Optionally sync user in your backend (before redirect)

  return response;
}
