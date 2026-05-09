import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { jsonError, missingServiceConfig } from "@/lib/api/responses";
import { deleteBlob } from "@/lib/blob/upload";
import { getRequiredServiceClient, writeAuditLog } from "@/lib/site-content/mutations";
import { assetPatchSchema } from "@/lib/site-content/validators";
import { assets, projectAssets, projects, testimonials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdmin();

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const { id } = await context.params;
    const input = assetPatchSchema.parse(await request.json());
    const db = getRequiredServiceClient();
    const [data] = await db
      .update(assets)
      .set({ ...input, updated_at: new Date() })
      .where(eq(assets.id, id))
      .returning();

    if (!data) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    await writeAuditLog({
      actorId: guard.auth.userId,
      action: "asset.update",
      entityType: "asset",
      entityId: id,
    });

    return NextResponse.json({ asset: data });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const guard = await requireAdmin();

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const { id } = await context.params;
    const db = getRequiredServiceClient();
    const [asset] = await db
      .select({ blob_pathname: assets.blob_pathname })
      .from(assets)
      .where(eq(assets.id, id))
      .limit(1);

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const [projectReference] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.primary_asset_id, id))
      .limit(1);
    const [testimonialReference] = await db
      .select({ id: testimonials.id })
      .from(testimonials)
      .where(eq(testimonials.avatar_asset_id, id))
      .limit(1);
    const [projectAssetReference] = await db
      .select({ project_id: projectAssets.project_id })
      .from(projectAssets)
      .where(eq(projectAssets.asset_id, id))
      .limit(1);

    if (projectReference || testimonialReference || projectAssetReference) {
      return NextResponse.json(
        { error: "Asset is still attached to site content and cannot be deleted." },
        { status: 409 }
      );
    }

    await db.delete(assets).where(eq(assets.id, id));
    await deleteBlob(asset.blob_pathname);

    await writeAuditLog({
      actorId: guard.auth.userId,
      action: "asset.delete",
      entityType: "asset",
      entityId: id,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error);
  }
}
