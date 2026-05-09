import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { jsonError, missingServiceConfig } from "@/lib/api/responses";
import {
  getBlobPublicUrl,
  uploadImageToBlob,
  validateImageFile,
  validateImageFileContent,
} from "@/lib/blob/upload";
import { getRequiredServiceClient, writeAuditLog } from "@/lib/site-content/mutations";
import { assets } from "@/lib/db/schema";

export async function POST(request: Request) {
  const guard = await requireAdmin();

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const altText = String(formData.get("alt_text") ?? "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!altText) {
      return NextResponse.json({ error: "Alt text is required." }, { status: 400 });
    }

    const fileError = validateImageFile(file);

    if (fileError) {
      return NextResponse.json({ error: fileError }, { status: 400 });
    }

    const contentError = await validateImageFileContent(file);

    if (contentError) {
      return NextResponse.json({ error: contentError }, { status: 400 });
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "image";
    const pathname = `admin/${guard.auth.userId}/${crypto.randomUUID()}.${extension}`;
    const blob = await uploadImageToBlob(file, pathname);
    const publicUrl = getBlobPublicUrl(blob);
    const db = getRequiredServiceClient();
    const [data] = await db
      .insert(assets)
      .values({
        blob_url: publicUrl,
        blob_pathname: blob.pathname,
        alt_text: altText,
        content_type: file.type,
        size_bytes: file.size,
        uploaded_by: guard.auth.userId,
      })
      .returning();

    await writeAuditLog({
      actorId: guard.auth.userId,
      action: "asset.upload",
      entityType: "asset",
      entityId: data.id,
    });

    return NextResponse.json({ asset: data }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error);
  }
}
