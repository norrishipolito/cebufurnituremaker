import { LoginForm } from "@/features/admin/auth/components/login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-xl font-semibold">Admin Sign In</h1>
        <p className="mt-1 mb-5 text-sm text-gray-600 dark:text-gray-400">
          Sign in with a Supabase user assigned to the admin or maintainer role.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
