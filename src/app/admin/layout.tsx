import type { ReactNode } from "react";
import { AdminChrome } from "./_components/admin-chrome";
import { getCurrentAdminProfile } from "@/lib/auth/require-admin";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const auth = await getCurrentAdminProfile();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950 dark:bg-gray-950 dark:text-gray-50">
      <AdminChrome profile={auth?.profile ?? null}>{children}</AdminChrome>
    </div>
  );
}
