import type { ReactNode } from "react";
import { AdminThemeProvider } from "./_components/admin-theme-provider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminThemeProvider>
      {children}
    </AdminThemeProvider>
  );
}
