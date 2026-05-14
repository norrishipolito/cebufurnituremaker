import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { defaultSiteContent } from "@/lib/default-site-content";
import { jsonError, missingServiceConfig } from "@/lib/api/responses";
import { getRequiredServiceClient, revalidatePublicSite, writeAuditLog } from "@/lib/site-content/mutations";
import { testimonialInputSchema } from "@/lib/site-content/validators";
import { createDbClient } from "@/lib/db/client";
import { testimonials } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const guard = await requireAdmin();

  if ("response" in guard) {
    return guard.response;
  }

  const db = createDbClient();

  if (!db) {
    return NextResponse.json({
      testimonials: defaultSiteContent.testimonials,
      source: "default",
    });
  }

  const data = await db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sort_order));

  return NextResponse.json({
    testimonials: data?.length ? data : defaultSiteContent.testimonials,
    source: data?.length ? "database" : "default",
  });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const db = getRequiredServiceClient();
    const input = testimonialInputSchema.parse(await request.json());
    const [data] = await db
      .insert(testimonials)
      .values({
        ...input,
        created_by: guard.auth.userId,
        updated_by: guard.auth.userId,
      })
      .returning();

    await writeAuditLog({
      actorId: guard.auth.userId,
      action: "testimonial.create",
      entityType: "testimonial",
      entityId: data.id,
    });
    await revalidatePublicSite();

    return NextResponse.json({ testimonial: data }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error);
  }
}
