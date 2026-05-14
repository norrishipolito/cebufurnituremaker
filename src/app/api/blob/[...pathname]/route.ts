import { NextResponse } from "next/server";
import { createDbClient } from "@/lib/db/client";
import { assets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPrivateBlob } from "@/lib/blob/upload";
import { logBackendError } from "@/lib/api/logger";

interface RouteContext {
  params: Promise<{ pathname: string[] }>;
}

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
      return new NextResponse(null, {
        status: 304,
        headers: Object.fromEntries(result.headers.entries()),
      });
    }

    return new NextResponse(result.stream, {
      status: 200,
      headers: {
        "Content-Type": asset.content_type,
        "Content-Length": String(result.blob.size),
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
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
