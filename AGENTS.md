# Repository Instructions

Before implementing features in this repository, read and follow:

- `docs/00-application-architecture.md`
- `docs/01-component-architecture-rules.md`
- `docs/02-feature-implementation-rules.md`
- The relevant feature plan in `docs/feature/`

Important standing rules:

- Keep feature plans updated as implementation changes.
- Editable content must have default fallbacks for an empty database.
- Admin content editing must use friendly form controls, not raw JSON.
- Placeholder text/images must be clearable after content is saved; do not force defaults back into saved empty fields.
- Project groups are editor-created text values, not a fixed enum.
- App database tables use Drizzle ORM; do not add manual Supabase SQL setup for schema changes.
- Supabase uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY`; legacy anon/service-role names are fallback only.
- `DATABASE_URL` is required for ORM-backed server reads and writes.
- Images use Vercel Blob through `BLOB_READ_WRITE_TOKEN`; `BLOB_ACCESS` must match the Blob store access mode.
- Admin access is role-based with `admin` and `maintainer`.
- Add or update Playwright tests for admin/public behavior and edge cases.
- Every user-reported bug must be covered by a regression test when feasible before calling the fix complete.
- Run `pnpm lint`, `pnpm build`, and `pnpm test:e2e` before marking implementation work complete.
