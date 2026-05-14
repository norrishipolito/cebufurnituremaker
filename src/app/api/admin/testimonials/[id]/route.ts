import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { jsonError, missingServiceConfig } from "@/lib/api/responses";
import { getRequiredServiceClient, revalidatePublicSite, writeAuditLog } from "@/lib/site-content/mutations";
import { testimonialInputSchema } from "@/lib/site-content/validators";
import { testimonials } from "@/lib/db/schema";
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
    const input = testimonialInputSchema.partial().parse(await request.json());
    const db = getRequiredServiceClient();
    const [data] = await db
      .update(testimonials)
      .set({
        ...input,
        updated_by: guard.auth.userId,
        updated_at: new Date(),
      })
      .where(eq(testimonials.id, id))
      .returning();

    if (!data) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    await writeAuditLog({
      actorId: guard.auth.userId,
      action: "testimonial.update",
      entityType: "testimonial",
      entityId: id,
    });
    await revalidatePublicSite();

    return NextResponse.json({ testimonial: data });
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
    await db.delete(testimonials).where(eq(testimonials.id, id));

    await writeAuditLog({
      actorId: guard.auth.userId,
      action: "testimonial.delete",
      entityType: "testimonial",
      entityId: id,
    });
    await revalidatePublicSite();

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error);
  }
}
