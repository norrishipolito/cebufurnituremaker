import type { ReactNode } from "react";
import { AdminChrome } from "./_components/admin-chrome";
import { AdminThemeProvider } from "./_components/admin-theme-provider";
import { getCurrentAdminProfile } from "@/lib/auth/require-admin";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const auth = await getCurrentAdminProfile();

  return (
    <AdminThemeProvider>
      <AdminChrome profile={auth?.profile ?? null}>{children}</AdminChrome>
    </AdminThemeProvider>
  );
}
