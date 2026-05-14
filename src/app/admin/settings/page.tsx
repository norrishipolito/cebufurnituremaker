import { redirect } from "next/navigation";
import { AdminPageShell } from "../_components/admin-page-shell";
import { getCurrentAdminProfile } from "@/lib/auth/require-admin";
import { canManageSettings } from "@/lib/auth/roles";

export default async function AdminSettingsPage() {
  const auth = await getCurrentAdminProfile();

  if (!auth) {
    redirect("/admin/login");
  }

  if (!canManageSettings(auth.profile.role)) {
    redirect("/admin");
  }

  return (
    <AdminPageShell
      title="Settings"
      description="Site-level settings are reserved for admin users in the first implementation."
    >
      <div className="rounded-lg border bg-white p-4 text-sm dark:bg-gray-900">
        Environment-backed settings required: Supabase URL/key, service role key,
        Vercel Blob token, admin hostname, and public site URL.
      </div>
    </AdminPageShell>
  );
}
