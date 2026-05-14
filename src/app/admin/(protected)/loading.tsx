import { AdminPageShell } from "../_components/admin-page-shell";

export default function ProtectedAdminLoading() {
  return (
    <AdminPageShell
      title="Loading"
      description="Preparing the admin page and latest editor data."
    >
      <div role="status" aria-label="Loading admin page" className="space-y-3">
        <div className="h-10 animate-pulse rounded-md bg-gray-100 dark:bg-gray-900" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-900"
            />
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
