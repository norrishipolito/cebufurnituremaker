import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { AdminProfile } from "@/lib/auth/roles";
import { Button } from "@/components/ui/button";
import { AdminSignOutButton } from "./admin-sign-out-button";
import { AdminThemeToggle } from "./admin-theme-toggle";

export function AdminHeader({ profile }: { profile: AdminProfile | null }) {
  return (
    <header className="sticky top-0 z-30 flex min-h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
      <div>
        <p className="text-sm font-medium">Admin</p>
        <p className="text-xs text-gray-500">
          {profile ? `${profile.email} - ${profile.role}` : "Not signed in"}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <AdminThemeToggle />
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            View Site
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
        {profile ? <AdminSignOutButton /> : null}
      </div>
    </header>
  );
}
