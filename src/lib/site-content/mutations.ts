import { revalidatePath } from "next/cache";
import type { SiteSectionKey } from "@/lib/default-site-content";
import { auditLogs, siteSections } from "@/lib/db/schema";
import { createDbClient, getRequiredDbClient } from "@/lib/db/client";

export function getRequiredServiceClient() {
  return getRequiredDbClient();
}

export async function revalidatePublicSite() {
  revalidatePath("/");
  revalidatePath("/projects/[slug]", "page");
}

export async function writeAuditLog(input: {
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  const db = createDbClient();

  if (!db) {
    return;
  }

  await db.insert(auditLogs).values({
    actor_id: input.actorId,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId,
    metadata: input.metadata ?? null,
  });
}

export async function upsertSiteSection(input: {
  key: SiteSectionKey;
  content: unknown;
  actorId: string;
}) {
  const db = getRequiredServiceClient();
  const [data] = await db
    .insert(siteSections)
    .values({
      key: input.key,
      content: input.content,
      updated_by: input.actorId,
      updated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: siteSections.key,
      set: {
        content: input.content,
        updated_by: input.actorId,
        updated_at: new Date(),
      },
    })
    .returning();

  await writeAuditLog({
    actorId: input.actorId,
    action: "site_section.upsert",
    entityType: "site_section",
    entityId: input.key,
  });
  await revalidatePublicSite();

  return data;
}
