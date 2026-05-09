import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSiteSection } from "@/lib/site-content/queries";
import { upsertSiteSection } from "@/lib/site-content/mutations";
import { jsonError } from "@/lib/api/responses";
import { siteSectionKeySchema } from "@/lib/site-content/validators";

interface RouteContext {
  params: Promise<{ sectionKey: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { sectionKey } = await context.params;
  const parsedKey = siteSectionKeySchema.safeParse(sectionKey);

  if (!parsedKey.success) {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  }

  const section = await getSiteSection(parsedKey.data);
  return NextResponse.json(section);
}

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdmin();

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const { sectionKey } = await context.params;
    const key = siteSectionKeySchema.parse(sectionKey);
    const content = await request.json();

    if (content === null || typeof content !== "object") {
      return NextResponse.json(
        { error: "Section content must be a JSON object or array." },
        { status: 400 }
      );
    }

    const data = await upsertSiteSection({
      key,
      content,
      actorId: guard.auth.userId,
    });

    return NextResponse.json({ data });
  } catch (error) {
    return jsonError(error);
  }
}
