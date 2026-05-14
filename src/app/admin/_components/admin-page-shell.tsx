import type { ReactNode } from "react";

export function AdminPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </main>
  );
}
