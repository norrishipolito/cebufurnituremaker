# Repository Instructions

Before every new chat, prompt, or implementation task in this repository, read and follow the repository documentation.

Required reading order:

1. `AGENTS.md`
2. Every Markdown file in `docs/rules/`
3. Every Markdown file directly under `docs/`
4. The relevant feature plan in `docs/feature/`
5. If the scope is broad or unclear, every Markdown file in `docs/feature/`

Modern agent setup:

- `AGENTS.md` is the cross-agent entrypoint.
- `docs/rules/` contains durable project rules.
- `.cursor/rules/always-read-docs.mdc` mirrors this startup rule for Cursor Agent.
- Keep these files synchronized whenever standing rules change.

Important standing rules:

- Research relevant current documentation and primary sources before implementing. Do not rely only on assumptions or remembered platform behavior.
- Keep documentation synchronized with implementation changes.
- Keep feature plans updated as implementation changes.
- Editable content must have default fallbacks for an empty database.
- Admin content editing must use friendly form controls, not raw JSON.
- Placeholder text/images must be clearable after content is saved; do not force defaults back into saved empty fields.
- Project grouping/type controls are retired from the editor and public UI; keep `projects.group` only as an internal compatibility field defaulted to `projects`.
- App database tables use Drizzle ORM; do not add manual Supabase SQL setup for schema changes.
- Supabase uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY`; legacy anon/service-role names are fallback only.
- `DATABASE_URL` is required for ORM-backed server reads and writes.
- Images use Vercel Blob through `BLOB_READ_WRITE_TOKEN`; `BLOB_ACCESS` must match the Blob store access mode.
- Admin access is role-based with `admin` and `maintainer`.
- Add or update Playwright tests for admin/public behavior and edge cases.
- Every user-reported bug must be covered by a regression test when feasible before calling the fix complete.
- Run `pnpm lint`, `pnpm build`, and `pnpm test:e2e` before marking implementation work complete.
