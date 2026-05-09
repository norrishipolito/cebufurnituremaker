"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { AdminProfile } from "@/lib/auth/roles";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

export function AdminChrome({
  children,
  profile,
}: {
  children: ReactNode;
  profile: AdminProfile | null;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
      <AdminSidebar className="hidden lg:block" profile={profile} />
      <div className="min-w-0">
        <AdminHeader profile={profile} />
        {children}
      </div>
    </div>
  );
}
