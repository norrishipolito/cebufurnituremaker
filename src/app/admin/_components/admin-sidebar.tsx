import Link from "next/link";
import {
  BookOpen,
  FolderKanban,
  Images,
  LayoutDashboard,
  MessageSquareQuote,
  Settings,
  Type,
  Users,
} from "lucide-react";
import type { AdminProfile } from "@/lib/auth/roles";
import { canManageSettings, canManageUsers } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: Type },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/settings", label: "Settings", icon: Settings, adminOnly: true },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
];

const supportNavItems = [
  { href: "/admin/documentation", label: "Documentation", icon: BookOpen },
];

export function AdminSidebar({
  className,
  profile,
}: {
  className?: string;
  profile: AdminProfile | null;
}) {
  const visibleItems = navItems.filter((item) => {
    if (!item.adminOnly) {
      return true;
    }

    return profile
      ? canManageUsers(profile.role) && canManageSettings(profile.role)
      : false;
  });

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col self-start overflow-hidden border-r border-gray-200 bg-white px-3 py-4 dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <Link href="/admin" className="mb-6 block px-3 text-sm font-semibold">
        Cebu Furniture Admin
      </Link>
      <nav className="space-y-1">
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex h-9 items-center gap-3 rounded-md px-3 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <nav className="mt-auto border-t border-gray-200 pt-3 dark:border-gray-800">
        {supportNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex h-9 items-center gap-3 rounded-md px-3 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
