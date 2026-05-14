import { type NextRequest, NextResponse } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const adminHostname = process.env.ADMIN_HOSTNAME;
  const host = request.headers.get("host")?.split(":")[0];
  const { pathname, search } = request.nextUrl;
  let response = NextResponse.next();
  let targetPathname = pathname;

  if (adminHostname && host === adminHostname && !pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = `/admin${pathname === "/" ? "" : pathname}`;
    url.search = search;
    response = NextResponse.rewrite(url);
    targetPathname = url.pathname;
  }

  if (shouldRefreshSupabaseSession(targetPathname)) {
    return updateSupabaseSession(request, response);
  }

  return response;
}

function shouldRefreshSupabaseSession(pathname: string) {
  if (pathname === "/admin/login") {
    return false;
  }

  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/api/admin/")
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
