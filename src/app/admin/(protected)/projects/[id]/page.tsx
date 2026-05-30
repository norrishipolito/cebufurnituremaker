import { AdminPageShell } from "../../../_components/admin-page-shell";

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
