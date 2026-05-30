import { NextResponse } from "next/server";
import { createDbClient } from "@/lib/db/client";
import { assets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPrivateBlob } from "@/lib/blob/upload";
import { logBackendError } from "@/lib/api/logger";

interface RouteContext {
  params: Promise<{ pathname: string[] }>;
}

const browserCacheControl = "public, max-age=3600, stale-while-revalidate=86400";
const vercelCdnCacheControl = "public, max-age=86400, stale-while-revalidate=604800";

export async function GET(request: Request, context: RouteContext) {
  try {
    const { pathname } = await context.params;
    const blobPathname = pathname.join("/");

    if (
      !blobPathname ||
      pathname.some((part) => !part || part === "." || part === "..")
    ) {
      return NextResponse.json({ error: "Blob pathname is required." }, { status: 400 });
    }

    const db = createDbClient();

    if (!db) {
      return new NextResponse("Not found", { status: 404 });
    }

    const [asset] = await db
      .select({ id: assets.id, content_type: assets.content_type })
      .from(assets)
      .where(eq(assets.blob_pathname, blobPathname))
      .limit(1);

    if (!asset || !asset.content_type.startsWith("image/")) {
      return new NextResponse("Not found", { status: 404 });
    }

    const result = await getPrivateBlob(
      blobPathname,
      request.headers.get("if-none-match")
    );

    if (!result) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (result.statusCode === 304) {
      const headers = new Headers(Object.fromEntries(result.headers.entries()));
      headers.set("Cache-Control", browserCacheControl);
      headers.set("Vercel-CDN-Cache-Control", vercelCdnCacheControl);

      return new NextResponse(null, {
        status: 304,
        headers,
      });
    }

    return new NextResponse(result.stream, {
      status: 200,
      headers: {
        "Content-Type": asset.content_type,
        "Content-Length": String(result.blob.size),
        "Cache-Control": browserCacheControl,
        "Vercel-CDN-Cache-Control": vercelCdnCacheControl,
        "X-Content-Type-Options": "nosniff",
        ETag: result.blob.etag,
      },
    });
  } catch (error) {
    logBackendError(error, {
      route: "/api/blob/[...pathname]",
      method: "GET",
      status: 500,
      message: "Unable to read blob.",
    });
    return NextResponse.json(
      { error: "Unable to read blob." },
      { status: 500 }
    );
  }
}
