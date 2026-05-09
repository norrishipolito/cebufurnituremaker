import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { missingServiceConfig } from "@/lib/api/responses";
import { createDbClient } from "@/lib/db/client";
import { assets } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const guard = await requireAdmin();

  if ("response" in guard) {
    return guard.response;
  }

  const db = createDbClient();

  if (!db) {
    return missingServiceConfig();
  }

  const data = await db.select().from(assets).orderBy(desc(assets.created_at));

  return NextResponse.json({ assets: data ?? [] });
}
