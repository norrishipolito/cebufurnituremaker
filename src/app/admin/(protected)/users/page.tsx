import { redirect } from "next/navigation";
import { AdminPageShell } from "../../_components/admin-page-shell";
import { getCurrentAdminProfile } from "@/lib/auth/require-admin";
import { canManageUsers, type AdminRole } from "@/lib/auth/roles";
import { createDbClient } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";
import { UserManager, type AdminUser } from "@/features/admin/users/components/user-manager";
import { desc } from "drizzle-orm";

export default async function AdminUsersPage() {
  const auth = await getCurrentAdminProfile();

  if (!auth) {
    redirect("/admin/login");
  }

  if (!canManageUsers(auth.profile.role)) {
    redirect("/admin");
  }

  const db = createDbClient();
  const data = db
    ? await db
        .select({
          id: profiles.id,
          email: profiles.email,
          display_name: profiles.display_name,
          role: profiles.role,
          created_at: profiles.created_at,
        })
        .from(profiles)
        .orderBy(desc(profiles.created_at))
    : [];
  const users: AdminUser[] = data.map((user) => ({
    ...user,
    role: user.role as AdminRole,
  }));

  return (
    <AdminPageShell
      title="Users"
      description="Create users, update profile details, assign roles, reset passwords, and remove users."
    >
      <UserManager currentUserId={auth.userId} initialUsers={users} />
    </AdminPageShell>
  );
}
