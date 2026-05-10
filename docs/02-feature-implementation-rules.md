# Feature Implementation Rules

## Purpose

These rules capture the implementation decisions agreed for Cebu Furniture Maker so future features are built consistently. Read this document before planning or implementing any new feature.

## Tech Stack Rules

- Build application routes and backend endpoints with Next.js App Router.
- Use tRPC for new backend-facing features that need typed client/server calls.
- Keep standard Next.js route handlers for HTTP-specific needs such as file uploads, webhooks, public asset delivery, auth callbacks, or endpoints that should not use tRPC.
- Existing route handlers do not need to be migrated to tRPC unless the feature work explicitly includes that migration.
- Build UI with React, TypeScript, Tailwind CSS, Radix UI primitives, lucide-react icons, and Framer Motion where animation already exists.
- Use Supabase Auth for authentication and `admin` / `maintainer` role access.
- Use Supabase Postgres with Drizzle ORM for app data, schema changes, and migrations.
- Use Vercel Blob for uploaded image storage.
- Use Zod for request validation and Playwright for end-to-end coverage.
- Keep the current tech stack documented in `README.md` and `docs/00-application-architecture.md` when dependencies or platform choices change.

## Required Workflow

For every feature:

1. Read the relevant files in `docs/feature/`.
2. Check whether the existing documentation is outdated.
3. Update the relevant feature plan before or during implementation.
4. Implement the feature using the existing app architecture.
5. Add or update Playwright tests for the user-facing behavior.
6. Run verification before considering the feature complete.

For every user-reported bug:

1. Reproduce or identify the failing behavior.
2. Add a regression test that would fail before the fix.
3. Implement the fix.
4. Run the focused regression test.
5. Keep the regression test in the suite so the bug cannot silently return.

Minimum verification:

```bash
pnpm lint
pnpm build
pnpm test:e2e
```

If a feature is documentation-only, tests are not required, but the doc change should still be reviewed for accuracy.

## Architecture Rules

- Follow `docs/00-application-architecture.md`.
- Follow `docs/01-component-architecture-rules.md`.
- Page-level route composition belongs in `src/app/**/_components/`.
- Reusable feature components belong in `src/features/**/components/`.
- Shared server/client utilities belong in `src/lib/`.
- Keep changes scoped to the feature being implemented.
- Prefer the existing patterns in the codebase over introducing a new abstraction.
- Database schema changes belong in `src/lib/db/schema.ts` and Drizzle migrations.

## Editable Content Rules

- Editable site content must have runtime defaults so the public site still renders when the database is empty.
- Defaults live in `src/lib/default-site-content.ts`.
- Public pages should read from database-backed helpers and fall back to defaults.
- Admin edit screens should prefill from database content when available and defaults when rows are missing.
- Saving default-backed content should create or update the database row.
- Deleting or missing section content should fall back to defaults.
- Once content is saved, editors must be able to clear placeholder text and image URLs without the UI forcing defaults back into those fields.
- Public-facing content mutations must revalidate the public page.
- The landing page must remain dynamic when it depends on editable content.
- Public pages must recover cleanly after browser back/forward navigation from missing routes; returning from a 404 must not leave the landing page blank.

## Admin UX Rules

- The admin UI must be practical, direct, and friendly for non-technical editors.
- Editable content must not be exposed as raw JSON.
- Use forms, inputs, textareas, selects, toggles, image URL/alt fields, and repeatable rows for structured content.
- Labels should describe the actual editable field, such as `Hero heading` or `Contact email`.
- Inputs should include example placeholders where helpful, such as `Category (ex. Dining Room)`.
- Admin pages should support the expected workflows: edit content, create/update projects, manage testimonials, review/update/delete media, and manage users according to role.
- Admin UI must include an authenticated Documentation page with a table-of-contents sidebar, page-by-page usage instructions, sample inputs, and quick workflow references.
- Desktop admin sidebar should include a bottom `Documentation` link.
- Admin content sections should be expandable/collapsible and collapsed by default so editors can focus on one area without losing quick access to the rest.
- Admin UI must support dark mode through an editor-facing toggle and should persist the selected admin theme locally.
- Footer social links are editable in the footer content editor. The public footer should expose Facebook, Instagram, and Twitter only unless a future feature explicitly adds another platform.
- Landing navigation is fixed site structure. Do not expose navigation links in the admin content editor or editable content API unless a future feature explicitly reopens that scope.
- CRUD-backed admin resources must expose the full workflow in the UI, including create, edit, delete, publish/unpublish where relevant, and any required attachment controls.
- Project images must be attachable from the project create/edit UI through an upload field plus alt text.
- Project public visibility must be controlled by an editor-facing checkbox labeled for the landing Projects section, not only a technical `published` label.
- Project ordering must be changed by dragging projects in the admin list. Dragging should show a visible active/target state and the list should adjust while dragging. Do not expose numeric sort-order inputs to editors.
- Testimonial public visibility must be controlled by an editor-facing checkbox labeled for the landing Testimonials section.
- Testimonial ordering must be changed by dragging testimonials in the admin list. Dragging should show a visible active/target state and the list should adjust while dragging. Do not expose numeric sort-order inputs to editors.
- `/admin/media` is read/update/delete only. Do not expose upload controls on the Media page.
- Image uploads should happen from the Projects page so project images are attached in the same workflow.
- Maintain a dense operational interface rather than a marketing-style page.

## Backend Rules

- Use Next.js App Router route handlers for backend endpoints.
- Keep admin APIs under `src/app/api/admin/`.
- Validate inputs with structured validators before writing to the database.
- Backend write failures should be logged with structured context through the shared API logger.
- Backend logs must use the shared server-only logger and include `timestamp`, `logLevel`, and `runtime: "backend"`.
- API logs should include route, method, status, actor id when available, error code, detail, hint, and constraint, but must not expose raw SQL query params or secrets.
- Return appropriate API statuses:
  - `400` for invalid input.
  - `401` for unauthenticated access.
  - `403` for authenticated users without permission.
  - `404` for missing entities.
  - `503` for missing required backend configuration.
- Use `revalidatePath("/")` after mutations that affect the public homepage.

## Database Rules

- Use Supabase Postgres for editable content, projects, testimonials, assets metadata, profiles, contact messages, and audit logs.
- Use Supabase Auth for sessions.
- Use Drizzle ORM for app table reads, writes, schema, and migrations.
- Do not require manual SQL execution in the Supabase dashboard for app table changes.
- Use `pnpm db:generate`, `pnpm db:migrate`, or `pnpm db:push` for schema changes.
- Use two app roles:
  - `admin`
  - `maintainer`
- Store flexible section content as `jsonb` internally when useful, but never make editors write JSON in the admin UI.
- Project groups are user-editable text values and should not be constrained to the original three placeholder groups.
- Enable Row Level Security on public schema tables.
- Route handlers must still enforce authorization server-side even when RLS exists.
- Publish/unpublish controls are for public visibility only. If an admin resource supports `DELETE`, the admin UI must include an explicit delete action that removes the record instead of merely hiding it.

## Environment Rules

Current Supabase key names:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
DATABASE_URL=
```

Legacy fallback names may remain supported:

```txt
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Image uploads use:

```txt
BLOB_READ_WRITE_TOKEN=
BLOB_ACCESS=private
```

Optional deployment/config variables:

```txt
ADMIN_HOSTNAME=
NEXT_PUBLIC_SITE_URL=
```

Never expose `SUPABASE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, or `BLOB_READ_WRITE_TOKEN` to client-side code.

## Image Rules

- Use Vercel Blob for uploaded images.
- Match `BLOB_ACCESS` to the Vercel Blob store access mode.
- Private Blob stores should upload with `access: "private"` and serve public site images through an app route.
- Store image metadata in Supabase.
- Require alt text for public images.
- Uploaded image content must match its declared safe image MIME type; do not trust file extensions or browser-provided MIME alone.
- Private blob reads should only serve registered image assets and should not expose internal storage errors to clients.
- Asset deletion must not delete blob storage before confirming the asset is not attached to projects, testimonials, or project asset links.
- Project create/edit forms must include image upload controls so project images can be attached without leaving the project workflow.
- Media page upload forms are not allowed; the Media page manages existing assets only.
- Accept safe web image types such as JPEG, PNG, WebP, and AVIF.
- Reject missing files and invalid MIME types.
- Keep uploaded image size limits documented and enforced.

## Authentication And RBAC Rules

- `/admin` pages require authentication.
- `/admin/login` must not show the admin header, sidebar, or admin navigation links.
- Authenticated admin pages must expose a visible sign-out action.
- Admin sign-out should clear only the current browser session, not every active session for the same Supabase user.
- Authenticated admin headers should stay sticky at the top of scrollable admin pages without creating nested page scrolling.
- `admin` has full access, including users and roles.
- `maintainer` can manage site content, projects, testimonials, and media.
- `maintainer` cannot manage users, roles, or protected settings.
- Maintainers must not see admin-only `Users` or `Settings` links in the admin sidebar.
- Maintainers must not see admin-only `Users` or `Settings` sections in the admin Documentation page.
- Every admin page and admin route handler must check session and role.
- Admin route handlers must reject requests with a mismatched `Origin` header before mutating data.
- User management must be full CRUD for admins: create, list, update profile details/password/role, and delete.
- User creation, email/password updates, and deletion must use Supabase Auth Admin plus the matching Drizzle `profiles` write.
- User deletion must detach nullable app-owned profile references before removing the profile/Auth user so authored content, audit logs, and assets do not block deletion.
- Nullable references to `profiles.id` should use `ON DELETE SET NULL`; `profiles.id` should reference `auth.users.id` with `ON DELETE CASCADE`.
- The signed-in admin cannot delete their own account or change their own role.
- The app must prevent removing the last remaining `admin` profile.
- Desktop admin sidebars should be sticky and should not use an internally scrollable sidebar container.

## Playwright Rules

- Playwright tests live in `tests/e2e/`.
- Use `tests/e2e/admin-helpers.ts` for shared admin login/API helpers.
- Every bug reported in chat or issue context must be covered by a regression test when it is feasible to automate.
- Regression tests should name the behavior that broke, not just the implementation detail.
- Test public behavior after admin mutations, not only the admin form response.
- Test admin user CRUD, role assignment, self-protection, and role-management authorization.
- Add regression coverage for public navigation bugs, including missing-page back navigation when reported.
- Restore mutated content after tests when possible.
- Avoid tests that assume the database is empty unless the test explicitly controls the database state.
- Prefer stable UI/role selectors over brittle CSS selectors.
- Cover desktop and mobile where practical.
- Skip duplicate DB-mutating tests on mobile when running the same mutation twice would create flaky shared state.

Authenticated admin tests use:

```txt
E2E_ADMIN_EMAIL=
E2E_ADMIN_PASSWORD=
```

Local PowerShell example:

```powershell
$env:E2E_ADMIN_EMAIL="test@cebufurnituremaker.com"; $env:E2E_ADMIN_PASSWORD="Password1."; pnpm test:e2e
```

## Documentation Rules

- Each feature plan belongs in `docs/feature/`.
- Update the plan when implementation details change.
- Include file architecture for new feature areas.
- Include environment variables and setup steps when a feature requires external services.
- Include test coverage expectations and how to run them.
- Keep setup guides beginner-friendly when they involve third-party services such as Supabase or Vercel Blob.

## Completion Checklist

Before calling a feature done:

- [ ] Feature documentation is current.
- [ ] Public pages still render with empty database defaults.
- [ ] Admin UI is form-based and editor-friendly.
- [ ] API endpoints validate input and enforce roles.
- [ ] Supabase and Blob env requirements are documented.
- [ ] Playwright covers the main workflow and edge cases.
- [ ] Every fixed user-reported bug has a regression test, or the reason it cannot be automated is documented.
- [ ] `pnpm lint` passes.
- [ ] `pnpm build` passes.
- [ ] `pnpm test:e2e` passes or skipped cases are clearly intentional.
