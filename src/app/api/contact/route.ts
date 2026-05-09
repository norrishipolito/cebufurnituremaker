import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api/responses";
import { createDbClient } from "@/lib/db/client";
import { contactMessages } from "@/lib/db/schema";
import { contactMessageSchema } from "@/lib/site-content/validators";

export async function POST(request: Request) {
  try {
    const input = contactMessageSchema.parse(await request.json());
    const db = createDbClient();

    if (!db) {
      return NextResponse.json({
        ok: true,
        stored: false,
        message: "Message validated. Configure DATABASE_URL to persist submissions.",
      });
    }

    const [data] = await db
      .insert(contactMessages)
      .values({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        inquiry: input.inquiry || null,
        message: input.message,
      })
      .returning();

    return NextResponse.json({ ok: true, stored: true, message: data });
  } catch (error) {
    return jsonError(error);
  }
}
