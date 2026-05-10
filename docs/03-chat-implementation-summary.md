# Chat Implementation Summary

## Purpose

This file compacts the implementation decisions, fixes, and standing rules agreed during the editable-admin buildout. Use it as a quick memory file before planning or implementing future features.

## Current Stack

- App: Next.js App Router, React, TypeScript, Tailwind CSS.
- Backend: Next.js route handlers for existing APIs.
- Future backend-facing features: use tRPC for typed client/server calls unless a route handler is better for uploads, webhooks, auth callbacks, or public asset delivery.
- Auth: Supabase Auth.
- Roles: `admin` and `maintainer`.
- Database: Supabase Postgres with Drizzle ORM.
- Image storage: Vercel Blob.
- Validation: Zod.
- Testing: Playwright E2E, ESLint, and production build checks.

## Editable Admin Scope

- Admin lives under `/admin`.
- `/admin/login` must not show admin header, sidebar, or admin navigation.
- Authenticated admin pages show the admin header, sticky sidebar, and sign-out button.
- Authenticated admin pages include a Documentation page linked from the bottom of the desktop sidebar. The documentation page should have its own table-of-contents sidebar and page-by-page admin UI instructions.
- Maintainers must not see admin-only Users or Settings navigation or documentation sections.
- Maintainers must not see `Users` or `Settings` links.
- Admins can manage users and assign roles.
- Existing admin APIs are REST-style route handlers. Do not migrate them to tRPC unless that migration is explicitly part of the task.

## Content Editing Rules

- Editable content must use UI-friendly form controls, not raw JSON.
- Sections currently edited through the Content page:
  - Hero
  - About
  - Contact
  - Footer
- Content sections are expandable/collapsible and should be collapsed by default when the Content page loads.
- Inputs should include practical example placeholders.
- Navigation is fixed site structure and is not editable through admin content.
- Public pages must continue rendering from runtime defaults when the database is empty.
- Saved content should override defaults, but editors must be able to clear placeholder text and image URLs.

## Footer Rules

- Footer content is editable through the Footer section of `/admin/content`.
- Editable footer fields include:
  - Brand description
  - Facebook URL
  - Instagram URL
  - Twitter URL
  - Footer columns and links
- Public footer social links must show Facebook, Instagram, and Twitter only.
- GitHub must not appear in the public footer unless a future feature explicitly adds it back.
- Footer social icons should use recognizable platform-specific logos.

## Projects Rules

- Projects have full CRUD in the admin UI.
- Project images are uploaded from the Projects page, not from Media.
- Project visibility uses an editor-facing checkbox for showing in the public Projects section.
- Project groups are editable text values. They are not limited to the original placeholder groups.
- Project sorting is drag-based. Do not expose numeric sort-order inputs.
- Dragging should show a visible drag state and live list adjustment.

## Testimonials Rules

- Testimonials have full CRUD in the admin UI.
- Testimonial visibility uses an editor-facing checkbox for showing in the public Testimonials section.
- Testimonial sorting is drag-based. Do not expose numeric sort-order inputs.
- Dragging should show a visible drag state and live list adjustment.

## Media Rules

- `/admin/media` is read/update/delete only.
- Do not expose upload controls on the Media page.
- Uploading images happens from the Projects page.
- Uploaded image content must match the declared safe image MIME type.
- Private Vercel Blob reads should serve only registered image assets.
- Asset deletion must be blocked while the asset is attached to projects, testimonials, or project asset links.

## User Management Rules

- User management is admin-only.
- Admins can create, list, update, assign roles, update passwords, and delete users.
- The signed-in admin cannot delete their own user or change their own role.
- The app must prevent removing the last remaining admin.
- User deletion must detach nullable app-owned profile references before deleting the profile/Auth user.
- Nullable references to `profiles.id` should use `ON DELETE SET NULL`.
- `profiles.id` should reference `auth.users.id` with `ON DELETE CASCADE`.

## Backend And Security Rules

- Admin APIs must check session and role server-side.
- Admin route handlers must reject mismatched `Origin` headers before mutating data.
- Backend write failures should use structured API logging.
- Backend logs must go through the server-only shared logger and include `timestamp`, `logLevel`, and `runtime: "backend"`.
- Logs should include useful context such as route, method, status, actor id, error code, detail, hint, and constraint.
- Logs must not expose raw SQL params or secrets.
- Use `revalidatePath("/")` after mutations that affect public homepage output.

## Environment Notes

Required Supabase and database variables:

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

Vercel Blob variables:

```txt
BLOB_READ_WRITE_TOKEN=
BLOB_ACCESS=private
```

Optional:

```txt
ADMIN_HOSTNAME=
NEXT_PUBLIC_SITE_URL=
```

Never expose server-only secrets to client-side code.

## Supabase And Drizzle Notes

- Schema changes should be represented in `src/lib/db/schema.ts`.
- Use Drizzle commands or the project `pnpm db:push` script for schema sync.
- Do not require manual SQL edits in Supabase for normal app table changes.
- `pnpm db:push` loads `.env.local` and `.env`.
- If the direct Supabase database URL fails with DNS issues, use the Supabase pooler URL.

## Playwright Rules

- Playwright tests live in `tests/e2e/`.
- Playwright loads `.env.local` and `.env` through `playwright.config.ts`.
- Authenticated admin tests use:

```txt
E2E_ADMIN_EMAIL=
E2E_ADMIN_PASSWORD=
```

- Every user-reported bug should get a regression test when feasible.
- Tests should use stable role/label selectors instead of brittle CSS selectors.
- DB-mutating tests may skip duplicate mobile runs to avoid shared-state flakiness.

## Verification Commands

Use these before calling a feature complete:

```bash
pnpm lint
pnpm build
pnpm test:e2e
```

Focused examples:

```bash
pnpm exec playwright test tests/e2e/admin-editing.spec.ts --project=chromium
pnpm exec playwright test tests/e2e/admin-crud.spec.ts --project=chromium
pnpm exec playwright test tests/e2e/admin-auth.spec.ts --project=chromium
```

## Fixed Bugs Captured In Tests

- Supabase publishable key naming replaced older anon-key-only assumptions.
- Hero/content edits save through admin and reflect publicly.
- Admin content editor is form-based, not raw JSON.
- Project create form no longer throws `Cannot read properties of null (reading 'reset')`.
- Project delete performs real deletion instead of only hiding.
- Project images upload from Projects page.
- Media page does not expose upload controls.
- Private Vercel Blob uploads use private access and private image serving.
- Spoofed image MIME uploads are rejected.
- Attached assets cannot be deleted before detaching from content.
- Public back navigation from missing routes should not leave revealed content blank.
- Maintainers cannot see or access admin-only Users/Settings management.
- Login page does not show admin chrome.
- Admin dark mode no longer causes hydration mismatch.
- Content sections land collapsed and can be expanded.
- Footer social links are editable and exclude GitHub.
- User deletion works even when the deleted user has authored content.

## Documentation Rule

When implementation details change, update:

- `docs/02-feature-implementation-rules.md`
- the relevant file in `docs/feature/`
- this summary when the change is broad enough to affect future work
