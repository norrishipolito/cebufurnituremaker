import { NextResponse } from "next/server";
import { getCurrentAdminProfile } from "@/lib/auth/require-admin";

export async function GET() {
  const auth = await getCurrentAdminProfile();

  if (!auth) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  return NextResponse.json({ profile: auth.profile });
}
