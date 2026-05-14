import { redirect } from "next/navigation";
import { AdminPageShell } from "../../../_components/admin-page-shell";
import { getCurrentAdminProfile } from "@/lib/auth/require-admin";

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await getCurrentAdminProfile();

  if (!auth) {
    redirect("/admin/login");
  }

  const { id } = await params;

  return (
    <AdminPageShell
      title="Project Detail"
      description="Detailed project editing will use the protected project API endpoint."
    >
      <div className="rounded-lg border bg-white p-4 dark:bg-gray-900">
        <p className="text-sm text-gray-600">Project ID: {id}</p>
      </div>
    </AdminPageShell>
  );
}
