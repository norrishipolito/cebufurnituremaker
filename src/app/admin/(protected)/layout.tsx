import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminChrome } from "../_components/admin-chrome";
import { getCurrentAdminProfile } from "@/lib/auth/require-admin";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const auth = await getCurrentAdminProfile();

  if (!auth) {
    redirect("/admin/login");
  }

  return <AdminChrome profile={auth.profile}>{children}</AdminChrome>;
}
