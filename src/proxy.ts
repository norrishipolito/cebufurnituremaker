import { type NextRequest, NextResponse } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const adminHostname = process.env.ADMIN_HOSTNAME;
  const host = request.headers.get("host")?.split(":")[0];
  const { pathname, search } = request.nextUrl;

  if (adminHostname && host === adminHostname && !pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = `/admin${pathname === "/" ? "" : pathname}`;
    url.search = search;
    return updateSupabaseSession(request, NextResponse.rewrite(url));
  }

  return updateSupabaseSession(request, NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
