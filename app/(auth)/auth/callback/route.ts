import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { syncSupabaseUser } from "@/lib/syncUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/profile";

  if (!code) {
    return NextResponse.redirect(
      new URL("/error?message=Missing code", req.url)
    );
  }

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_SITE_LOCAL!
      : process.env.NEXT_PUBLIC_SITE_URL!;

  const response = NextResponse.redirect(new URL(next, baseUrl));

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

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("exchangeCodeForSession error:", error);
    return NextResponse.redirect(
      new URL("/error?message=Auth+failed", baseUrl)
    );
  }

  const user = data?.user;
  if (user) {
    try {
      await syncSupabaseUser(user);
    } catch (err) {
      console.error("syncSupabaseUser error (non-fatal):", err);
    }
  }

  return response;
}
