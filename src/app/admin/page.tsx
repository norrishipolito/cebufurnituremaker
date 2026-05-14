import { redirect } from "next/navigation";
import { AdminPageShell } from "./_components/admin-page-shell";
import { AdminNavLink } from "./_components/admin-navigation-progress";
import { getCurrentAdminProfile } from "@/lib/auth/require-admin";
import { canManageUsers } from "@/lib/auth/roles";
import { Button } from "@/components/ui/button";

const cards = [
  { href: "/admin/content", title: "Content", text: "Edit section text and default-backed JSON." },
  { href: "/admin/projects", title: "Projects", text: "Manage project cards, groups, and publishing." },
  { href: "/admin/media", title: "Media", text: "Review uploaded images and manage alt text." },
  {
    href: "/admin/users",
    title: "Users",
    text: "Admin-only user and role management.",
    adminOnly: true,
  },
];

export default async function AdminDashboardPage() {
  const auth = await getCurrentAdminProfile();

  if (!auth) {
    redirect("/admin/login");
  }

  const visibleCards = cards.filter(
    (card) => !card.adminOnly || canManageUsers(auth.profile.role)
  );

  return (
    <AdminPageShell
      title="Dashboard"
      description="Editable content control center for Cebu Furniture Maker."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visibleCards.map((card) => (
          <div key={card.href} className="rounded-lg border bg-white p-4 dark:bg-gray-900">
            <h2 className="font-semibold">{card.title}</h2>
            <p className="mt-1 min-h-10 text-sm text-gray-600 dark:text-gray-400">
              {card.text}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <AdminNavLink href={card.href}>Open</AdminNavLink>
            </Button>
          </div>
        ))}
      </div>
    </AdminPageShell>
  );
}
