# Editable Admin Implementation

## Summary

This plan converts the current static Cebu Furniture Maker landing page into an editable site while preserving a complete default experience when the database starts empty.

Chosen stack:

- Frontend and backend: existing Next.js App Router app.
- Admin location: `/admin`, exposed through an admin subdomain rewrite.
- Database and auth: Supabase Postgres managed through Drizzle ORM + Supabase Auth.
- Image storage: Vercel Blob.
- Roles: `admin` and `maintainer`.
- E2E tests: Playwright.

The public site must never look empty just because Supabase has no rows. Current static text, project data, testimonials, contact details, footer content, and images should move into a default-content module and act as runtime fallbacks until database content is created. Navigation remains fixed site structure.

## File Architecture

```txt
docs/
`-- feature/
    `-- 07-editable-admin-implementation.md

src/
|-- proxy.ts
|-- app/
|   |-- admin/
|   |   |-- layout.tsx
|   |   |-- login/
|   |   |   `-- page.tsx
|   |   |-- (protected)/
|   |   |   |-- layout.tsx
|   |   |   |-- loading.tsx
|   |   |   |-- page.tsx
|   |   |   |-- content/
|   |   |   |   `-- page.tsx
|   |   |   |-- projects/
|   |   |   |   |-- page.tsx
|   |   |   |   `-- [id]/
|   |   |   |       `-- page.tsx
|   |   |   |-- testimonials/
|   |   |   |   `-- page.tsx
|   |   |   |-- media/
|   |   |   |   `-- page.tsx
|   |   |   |-- documentation/
|   |   |   |   `-- page.tsx
|   |   |   |-- settings/
|   |   |   |   `-- page.tsx
|   |   |   `-- users/
|   |   |       `-- page.tsx
|   |   `-- _components/
|   |       |-- admin-chrome.tsx
|   |       |-- admin-header.tsx
|   |       |-- admin-navigation.tsx
|   |       |-- admin-page-shell.tsx
|   |       |-- admin-route-prefetcher.tsx
|   |       |-- admin-sidebar.tsx
|   |       |-- admin-sign-out-button.tsx
|   |       |-- admin-theme-provider.tsx
|   |       `-- admin-theme-toggle.tsx
|   `-- api/
|       |-- admin/
|       |   |-- me/
|       |   |   `-- route.ts
|       |   |-- content/
|       |   |   `-- [sectionKey]/
|       |   |       `-- route.ts
|       |   |-- projects/
|       |   |   |-- route.ts
|       |   |   `-- [id]/
|       |   |       `-- route.ts
|       |   |-- testimonials/
|       |   |   |-- route.ts
|       |   |   `-- [id]/
|       |   |       `-- route.ts
|       |   |-- assets/
|       |   |   |-- route.ts
|       |   |   |-- upload/
|       |   |   |   `-- route.ts
|       |   |   `-- [id]/
|       |   |       `-- route.ts
|       |   `-- users/
|       |       |-- route.ts
|       |       `-- [id]/
|       |           |-- route.ts
|       |           `-- role/
|       |               `-- route.ts
|       `-- contact/
|           `-- route.ts
|-- features/
|   |-- admin/
|   |   |-- auth/
|   |   |   `-- components/
|   |   |       `-- login-form.tsx
|   |   |-- content/
|   |   |   `-- components/
|   |   |       `-- content-section-editor.tsx
|   |   |-- projects/
|   |   |   `-- components/
|   |   |       |-- project-form.tsx
|   |   |       `-- project-manager.tsx
|   |   |-- testimonials/
|   |   |   `-- components/
|   |   |       `-- testimonial-manager.tsx
|   |   |-- media/
|   |   |   `-- components/
|   |   |       `-- media-manager.tsx
|   |   `-- users/
|   |       `-- components/
|   |           `-- user-manager.tsx
|   `-- home/
|       `-- existing public-site features
`-- lib/
    |-- default-site-content.ts
    |-- site-content/
    |   |-- queries.ts
    |   |-- mutations.ts
    |   `-- validators.ts
    |-- supabase/
    |   |-- client.ts
    |   |-- server.ts
    |   `-- middleware.ts
    |-- auth/
    |   |-- roles.ts
    |   `-- require-admin.ts
    `-- blob/
        `-- upload.ts

tests/
`-- e2e/
    |-- public-empty-db.spec.ts
    |-- admin-helpers.ts
    |-- admin-auth.spec.ts
    |-- admin-rbac.spec.ts
    |-- admin-content.spec.ts
    |-- admin-editing.spec.ts
    |-- admin-crud.spec.ts
    |-- admin-projects.spec.ts
    |-- admin-media.spec.ts
    `-- contact.spec.ts

playwright.config.ts
```

## Key Changes

- Add `src/lib/default-site-content.ts` with current default content for hero, about, projects, testimonials, contact, fixed navigation, and footer.
- Add Drizzle read helpers that query database content first and return defaults when rows are missing.
- Add admin routes for dashboard, editable sections, projects, testimonials, media, settings, and users.
- Add a guided content editor for hero, about, contact, and footer sections. Editable content must use form fields, lists, selects, and image URL/alt inputs instead of raw JSON editing.
- Add protected API endpoints for CRUD operations and Vercel Blob uploads.
- Add a Next.js proxy that rewrites the configured admin hostname to `/admin` while preserving paths.
- Add server-side RBAC checks in every admin page and route handler.
- Update public landing sections to consume typed content helpers instead of importing static feature data directly.
- Mark the landing page as dynamic so saved admin edits are read on request and reflected publicly after content mutations.
- Keep the current component architecture rule: admin page layout components belong in `app/admin/_components`, while reusable admin sub-components belong in `features/admin`.

## Default Empty-Database Behavior

The database will start empty, so fallbacks are required at runtime.

Rules:

- The public homepage renders fully when Supabase has zero editable rows.
- Default images can remain the current Unsplash URLs until replaced through the admin.
- Public read helpers return Supabase content when published rows exist.
- Public read helpers return local defaults when no matching rows exist.
- Admin edit screens load database content when it exists.
- Admin edit screens prefill from default content when the database is empty.
- Saving a default-backed form upserts the corresponding database row.
- Deleting section content falls back to defaults.
- Projects and testimonials use publish/unpublish controls for public visibility and explicit delete actions for records that should be removed.
- Unpublished database records do not appear publicly.
- A future seed script may insert defaults into Supabase, but runtime fallback is still required.

Suggested default module shape:

```ts
export const defaultSiteContent = {
  hero: {
    heading: "Design furniture for spaces that breathe.",
    emphasizedHeading: "spaces that breathe.",
    tagline: "Designed in Cebu, crafted to endure - timeless pieces for modern living.",
    backgroundImage: {
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2070&auto=format&fit=crop",
      alt: "Modern interior with handcrafted furniture",
    },
    footerFeatures: [
      { icon: "Truck", text: "Free shipping" },
      { icon: "Rocket", text: "Delivered in 6 weeks" },
      { icon: "Shield", text: "Lifetime guarantee" },
    ],
  },
  projects: [],
  testimonials: [],
  about: {},
  contact: {},
  navigation: {},
  footer: {},
} as const;
```

## Roles And Permissions

Supported roles:

- `admin`
- `maintainer`

Permissions:

- `admin`: full access to content, projects, testimonials, media, settings, users, role changes, and audit logs.
- `maintainer`: can create, update, publish, unpublish, and upload content/media for the site; cannot manage users, change roles, or access protected admin settings.
- Maintainers should not see `Users` or `Settings` links in the admin sidebar.

Enforcement:

- Supabase Auth handles sessions.
- Drizzle ORM handles app table reads, writes, schema, and migrations.
- Supabase RLS should be enabled on admin tables.
- Next.js route handlers must also check role permissions before mutations.
- API responses should use `401` for unauthenticated users and `403` for authenticated users without permission.

## Database Schema

Documented target schema. This SQL is for reference only; the source of truth is `src/lib/db/schema.ts`, and changes should be applied with Drizzle commands.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role text not null check (role in ('admin', 'maintainer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table site_sections (
  key text primary key,
  content jsonb not null,
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table assets (
  id uuid primary key default gen_random_uuid(),
  blob_url text not null,
  blob_pathname text not null,
  alt_text text not null,
  content_type text not null,
  size_bytes integer not null,
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  category text not null,
  "group" text not null,
  primary_asset_id uuid references assets(id),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table project_assets (
  project_id uuid not null references projects(id) on delete cascade,
  asset_id uuid not null references assets(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (project_id, asset_id)
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  quote text not null,
  avatar_asset_id uuid references assets(id),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  inquiry text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

`site_sections.content` is stored as `jsonb` for flexible structured data, but this is an internal persistence detail only. The admin UI must expose friendly form fields and repeatable rows instead of asking editors to read or write JSON.

Enable RLS:

```sql
alter table profiles enable row level security;
alter table site_sections enable row level security;
alter table assets enable row level security;
alter table projects enable row level security;
alter table project_assets enable row level security;
alter table testimonials enable row level security;
alter table contact_messages enable row level security;
alter table audit_logs enable row level security;
```

## API Endpoints

Protected admin endpoints:

- `GET /api/admin/me`
- `GET /api/admin/content/[sectionKey]`
- `PATCH /api/admin/content/[sectionKey]`
- `GET /api/admin/projects`
- `POST /api/admin/projects`
- `GET /api/admin/projects/[id]`
- `PATCH /api/admin/projects/[id]`
- `DELETE /api/admin/projects/[id]`
- `GET /api/admin/testimonials`
- `POST /api/admin/testimonials`
- `GET /api/admin/testimonials/[id]`
- `PATCH /api/admin/testimonials/[id]`
- `DELETE /api/admin/testimonials/[id]`
- `GET /api/admin/assets`
- `POST /api/admin/assets/upload`
- `PATCH /api/admin/assets/[id]`
- `DELETE /api/admin/assets/[id]`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `GET /api/admin/users/[id]`
- `PATCH /api/admin/users/[id]`
- `DELETE /api/admin/users/[id]`
- `PATCH /api/admin/users/[id]/role`

Public endpoint:

- `POST /api/contact`

Validation rules:

- Validate session and role before every admin operation.
- Reject admin API requests that include a mismatched `Origin` header.
- Validate required fields, string lengths, enum values, and JSON section shapes.
- Validate image MIME type, image size, and required alt text before Vercel Blob upload.
- Validate uploaded image file signatures so spoofed MIME types are rejected.
- Return `400` for invalid input, `401` for unauthenticated access, `403` for unauthorized access, and `404` for missing entities.
- Call `revalidatePath("/")` after mutations that affect public pages.

## Image Handling

Use Vercel Blob for uploaded images.

Flow:

1. Admin or maintainer selects an image in the project create/edit workflow.
2. Client submits to `POST /api/admin/assets/upload`.
3. Route validates auth, role, MIME type, size, and alt text.
4. Route uploads the file to Vercel Blob.
5. Route writes an `assets` row with the returned blob URL/pathname.
6. Project records reference asset IDs.

Recommended constraints:

- Accept `image/jpeg`, `image/png`, `image/webp`, and `image/avif`.
- Reject SVG uploads unless a later security review explicitly allows them.
- Start with a 5 MB max file size.
- Require alt text for public images.
- Private blob reads should only serve registered image assets and should return generic errors to clients.
- Asset deletion should be blocked while the asset is still attached to projects, testimonials, or project asset links.

`next.config.ts` must allow the Vercel Blob image host used by deployment.

Blob access can be public or private. This app supports both:

- `BLOB_ACCESS=private` uploads with `access: "private"` and serves images through `/api/blob/[...pathname]`.
- `BLOB_ACCESS=public` uploads with `access: "public"` and stores the direct public blob URL.

If the Vercel Blob store was created as private, `BLOB_ACCESS` must be `private`. Vercel rejects `access: "public"` on a private store.

## Admin UX

Initial admin pages:

- Dashboard: content status, recently edited items, quick links.
- Content: guided section editors for hero, about, contact, and footer. The editor must not expose raw JSON to normal users.
- Projects: list, create, edit, delete, publish/unpublish, upload/attach images, and drag-sort saved records.
- Testimonials: list, create, edit, delete, publish/unpublish, and drag-sort saved records.
- Media: read uploaded assets, edit alt text, and delete unused assets. Media must not expose an upload form.
- Settings: site-level settings for admins.
- Users: create, list, edit profile details, reset passwords, assign roles, and delete users for admins only.
- The sidebar must hide admin-only `Users` and `Settings` links for maintainers.
- Documentation: authenticated admin manual with a table-of-contents sidebar, page-by-page workflow guidance, sample inputs, and visual UI previews.
- The Documentation page must hide admin-only `Users` and `Settings` manual sections from maintainers.
- The desktop sidebar includes a bottom `Documentation` link.
- Admin login, sign-out, sidebar, and dashboard navigation keep the clicked controls pending while server-authenticated route changes are resolving so deployed pages do not appear idle or re-enabled mid-transition. Admin route changes should not show a global horizontal progress bar.
- Supabase session refresh in the proxy is scoped to authenticated admin/admin API routes so public pages do not pay an auth network round trip on every request.
- Admin profile lookup is request-cached so the authenticated layout and matching page do not repeat the same Supabase/profile queries during one render.
- Authenticated admin pages live under an internal `(protected)` route group so `/admin/login` does not fetch or reuse the authenticated admin chrome/profile layout.
- Admin auth verification uses Supabase `getClaims()` instead of `getUser()` so deployments with asymmetric JWT signing keys can validate access tokens locally or from the cached JWKS path instead of calling Supabase Auth on every navigation.
- Sidebar and dashboard admin links prefetch on idle, hover, and focus, and protected admin routes expose a content loading skeleton while server data resolves.

The admin should be practical and dense rather than marketing-like. Use existing UI primitives and keep forms predictable.
The desktop admin sidebar should stay sticky and must not have its own scrollable container.
The authenticated admin header should stay sticky at the top of scrollable admin pages and must not create a nested page scroll container.
The admin header should include a visible `Sign out` action for authenticated users. Sign-out should clear only the current browser session, not every active session for the same Supabase user.
The `/admin/login` page should not show the admin header, sidebar, or navigation links because the user is not authenticated yet.

Content editor field expectations:

- Hero: heading, emphasized heading, tagline, background image URL, background alt text, and editable footer feature rows.
- About: title, description, showcase title, showcase image URL, showcase image alt text, and showcase description.
- Contact: title, description, email, email card description, project inquiry card title/value/description, phone, phone card description, address, address card description, hours title, and workshop hours.
- Footer: brand description, editable Facebook/Instagram/Twitter social URLs, and editable footer columns/links.
- Navigation is fixed site structure and should not be exposed in the admin content editor or editable content API.
- Content sections are expandable/collapsible and should be collapsed by default when the editor page loads.
- The About showcase description should appear below the showcase title and showcase image URL fields.
- The admin header includes a dark mode toggle for authenticated users, and the chosen admin theme is persisted in local storage.

Save actions call the matching section endpoint and should revalidate the public homepage so changes appear after saving.

Editable placeholder rules:

- Default content is placeholder content only.
- Admin editors must be able to clear placeholder text and image URLs.
- Public components must tolerate empty text and empty image URLs without crashing.
- Repeatable placeholder rows, such as hero features, footer columns, and footer links, must be removable.
- Inputs should show examples through placeholders, such as `Category (ex. Dining Room)`.

Project grouping rules:

- Project grouping/type controls are retired from the admin editor and public UI.
- The public Projects section renders all published projects together in one polished grid with no tabs.
- The existing `projects.group` database column remains for compatibility only.
- New project writes from the editor and API default `projects.group` to `projects` when the client does not provide a value.

Project CRUD rules:

- The project admin UI must expose create, edit, delete, publish/unpublish, image attachment, and sorting controls.
- The project visibility checkbox should be labeled `Show in Projects section` and should write to `projects.published`.
- The public Projects component should show saved public projects together in one grid. Editors review newly added public projects in that single Projects section.
- Project create/edit forms must include an image upload input and image alt text input. The UI uploads the image through `POST /api/admin/assets/upload` and saves the returned asset ID as `projects.primary_asset_id`.
- Project create/edit forms support selecting multiple safe image files at once. Uploaded images are attached to the saved project through `project_assets`, shown as thumbnail previews in the admin list, and can be detached from the project without deleting the media asset.
- Uploaded project images must be loaded by public project queries with nested `primary_asset` data so saved images appear on the landing page.
- Editors must not type numeric sort values. Project order is changed by dragging the project handles in the saved project list, with a visible drag state and live list adjustment, then persisting `sort_order` through the project update endpoint.
- The delete button must call `DELETE /api/admin/projects/[id]`, remove the row from the admin list, and remove the project from public output. Hiding/unpublishing is not a substitute for deletion.

Testimonial CRUD rules:

- The testimonial admin UI must expose create, edit, delete, publish/unpublish, and sorting controls.
- Editors must not type numeric sort values. Testimonial order is changed by dragging testimonial handles in the saved list, with a visible drag state and live list adjustment, then persisting `sort_order` through the testimonial update endpoint.
- The testimonial visibility checkbox should be labeled `Show in Testimonials section` and should write to `testimonials.published`.

Media rules:

- `/admin/media` is read/update/delete only.
- Media upload controls must not appear on the Media page.
- Image uploads happen from the Projects page so project images can be attached in the same workflow.
- The Media page can update asset alt text and delete unused assets.

User management rules:

- User management is full CRUD and is admin-only.
- Create users through Supabase Auth Admin and write the matching `profiles` row through Drizzle.
- Update user email, display name, optional password reset, and role from the admin UI.
- Delete users from Supabase Auth and `profiles`.
- Before deleting a user, detach nullable app-owned profile references such as authored projects, updated content, uploaded assets, testimonials, and audit log actor references. Those foreign keys should use `ON DELETE SET NULL` so deleting a user does not delete or block existing site content.
- Role assignment must be explicit through an editor-facing role selector.
- The signed-in admin cannot delete their own user or change their own role.
- The system must keep at least one `admin` profile.

If your database was created from the older schema with a check constraint on `projects.group`, remove that constraint before using custom groups. In Supabase SQL Editor, run a targeted constraint lookup:

```sql
select conname
from pg_constraint
where conrelid = 'public.projects'::regclass
  and pg_get_constraintdef(oid) like '%products%'
  and pg_get_constraintdef(oid) like '%showroom%'
  and pg_get_constraintdef(oid) like '%fabrication_site%';
```

Then replace `PASTE_CONSTRAINT_NAME_HERE` and run:

```sql
alter table public.projects
drop constraint if exists PASTE_CONSTRAINT_NAME_HERE;
```

## Playwright Installation

Install Playwright:

```bash
pnpm create playwright
pnpm exec playwright install
```

Add scripts:

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:report": "playwright show-report"
}
```

Configure `playwright.config.ts` with a local web server:

```ts
use: {
  baseURL: "http://127.0.0.1:3100",
}

webServer: {
  command: "pnpm start --port 3100",
  url: "http://127.0.0.1:3100",
  reuseExistingServer: !process.env.CI,
}
```

The test server uses port `3100` so local development can keep using `pnpm dev` on port `3000`.

For authenticated admin tests, set credentials before running the suite:

```bash
E2E_ADMIN_EMAIL=test@cebufurnituremaker.com E2E_ADMIN_PASSWORD=Password1. pnpm test:e2e
```

On PowerShell:

```powershell
$env:E2E_ADMIN_EMAIL="test@cebufurnituremaker.com"; $env:E2E_ADMIN_PASSWORD="Password1."; pnpm test:e2e
```

## Playwright Test Coverage

Test files:

- `tests/e2e/public-empty-db.spec.ts`
- `tests/e2e/admin-helpers.ts`
- `tests/e2e/admin-auth.spec.ts`
- `tests/e2e/admin-rbac.spec.ts`
- `tests/e2e/admin-content.spec.ts`
- `tests/e2e/admin-editing.spec.ts`
- `tests/e2e/admin-crud.spec.ts`
- `tests/e2e/admin-projects.spec.ts`
- `tests/e2e/admin-media.spec.ts`
- `tests/e2e/contact.spec.ts`

Scenarios:

- Empty database still renders the public homepage through runtime defaults. If database rows exist, tests should verify stable editable sections and the single public Projects grid rather than hard-coded starter copy.
- Admin subdomain rewrites to `/admin`.
- Logged-out users are redirected to login.
- The login page does not show the admin header, sidebar, or admin navigation links.
- Signed-in admins can sign out from the admin header and are returned to `/admin/login`.
- Admin content editor renders guided form controls instead of a raw JSON textarea.
- Admin can edit hero content and the updated heading/tagline appear on the public homepage.
- Admin can edit about, contact, and footer content and those changes appear publicly.
- Navigation is not editable in the admin content UI and `PATCH /api/admin/content/navigation` is rejected.
- Content-editing tests restore the original section content after mutation.
- User-reported admin bugs must receive regression tests before the fix is considered complete.
- Admin can create, edit, publish, unpublish, and delete projects.
- Admin project form submission succeeds without async form reset errors after creating a project.
- Admin project UI includes image upload and alt text controls in the project workflow.
- Admin project UI does not expose numeric sort order inputs; sorting is driven from drag handles in the list.
- Admin can mark a project as shown/hidden in the landing Projects section, and the public section reflects that checkbox.
- Admin project delete removes the record from the admin UI and public site instead of only changing the project status to hidden.
- Admin can create, edit, publish, unpublish, delete, and drag-sort testimonials.
- Admin testimonial UI does not expose numeric sort order inputs; sorting is driven from drag handles in the list.
- Media page does not expose upload controls and supports read/update/delete for existing assets.
- Admin can create, edit, assign roles to, reset passwords for, and delete users.
- Admin cannot delete their own account or change their own role.
- The admin sidebar is sticky and does not scroll internally.
- Maintainer can edit content and projects.
- Maintainer cannot access user or role management.
- Maintainer cannot see `Users` or `Settings` in the desktop sidebar.
- Invalid project data shows validation errors.
- Duplicate project slugs are rejected.
- Valid image upload succeeds and updates a public project image.
- Invalid image type, missing file, oversized file, and missing alt text are rejected.
- Contact form validates required fields and stores a message.
- Public homepage works on desktop and mobile after admin edits.

## Supabase Setup Guide

This section is written for a first-time Supabase setup using the hosted dashboard.

Official docs used for this setup:

- Supabase Platform: https://supabase.com/docs/guides/platform
- API keys: https://supabase.com/docs/guides/getting-started/api-keys
- Auth users: https://supabase.com/docs/guides/auth/users
- User profile tables: https://supabase.com/docs/guides/auth/managing-user-data
- Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security

### 1. Create A Supabase Project

1. Go to https://supabase.com/dashboard.
2. Sign in or create an account.
3. In the left/top organization switcher, choose or create an organization.
4. Click `New project`.
5. Fill in:
   - `Name`: `cebu-furniture-maker`
   - `Database Password`: generate and store it somewhere safe.
   - `Region`: choose the closest region to the site users or deployment region.
   - `Pricing Plan`: Free is fine for initial development.
6. Click `Create new project`.
7. Wait until the project dashboard finishes provisioning.

Supabase projects include a Postgres database, generated APIs, Auth, user management, Edge Functions, Realtime, and Storage. This implementation uses the database and Auth parts; image files use Vercel Blob instead of Supabase Storage.

### 2. Copy Environment Variables

In your Supabase project dashboard:

1. Click `Connect` in the top bar, or go to `Project Settings` -> `Data API`.
2. Copy the project URL into:

```txt
NEXT_PUBLIC_SUPABASE_URL=
```

3. Copy the `publishable` browser key into:

```txt
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Publishable keys usually start with `sb_publishable_`. They are safe to use in browser code when Row Level Security policies are configured. If your dashboard only shows legacy keys, this implementation still supports `NEXT_PUBLIC_SUPABASE_ANON_KEY` as a fallback.

4. Copy the server-only elevated key into:

```txt
SUPABASE_SECRET_KEY=
```

Secret keys usually start with `sb_secret_`. Use this for trusted server-side route handlers only. If your dashboard only shows legacy keys, this implementation still supports `SUPABASE_SERVICE_ROLE_KEY` as a fallback.

Never expose `SUPABASE_SECRET_KEY` in browser code, public docs, screenshots, or client-side environment variables. In this app it is only read by server route handlers and server helpers.

5. Copy the Postgres connection string into:

```txt
DATABASE_URL=
```

Use the Supabase `Connect` flow or `Project Settings` -> `Database`. Prefer the pooler URI for deployed/serverless environments, replace `[YOUR-PASSWORD]`, and URL-encode special characters in the password.

If the direct URL host looks like `db.<project-ref>.supabase.co` and `pnpm db:push` fails with `getaddrinfo ENOTFOUND`, use the pooler connection string instead.

Local `.env.local` example:

```txt
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
SUPABASE_SECRET_KEY=sb_secret_your_key
DATABASE_URL=postgresql://postgres.your-ref:your-password@aws-0-region.pooler.supabase.com:6543/postgres
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
BLOB_ACCESS=private
ADMIN_HOSTNAME=admin.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

After changing env vars, restart `pnpm dev`.

### 3. Apply The Database Schema With Drizzle

Do not paste the schema into the Supabase SQL Editor for normal setup. The app schema is managed in `src/lib/db/schema.ts` and applied through Drizzle.

1. Add `DATABASE_URL` to `.env.local`.
2. For a fresh database, run:

```bash
pnpm db:migrate
```

3. For an existing Supabase database that may already have tables, run:

```bash
pnpm db:push
```

4. Confirm tables:
   - Open `Table Editor` from the Supabase left sidebar.
   - Confirm these tables exist in the `public` schema:
   - `profiles`
   - `site_sections`
   - `assets`
   - `projects`
   - `project_assets`
   - `testimonials`
   - `contact_messages`
   - `audit_logs`

### 4. RLS Policies

The Drizzle schema enables Row Level Security and generates the app table policies. Supabase recommends enabling RLS for exposed public-schema tables. Once RLS is enabled, rows are not accessible through the public API unless policies allow it.

Do not add policies manually unless the Drizzle schema is also updated to match.

### 5. Create The First Admin User

Create the Supabase Auth user and matching `profiles` row without manual SQL:

```bash
pnpm db:admin -- --email you@example.com --password Password1. --name "Your Name" --role admin
```

Open `Table Editor` -> `profiles` and confirm your row exists with role `admin`.

You can now sign in at `/admin/login`.

### 6. Add Maintainer Users Later

After the first admin can sign in:

1. Use `/admin/users` once the app is deployed/configured, or use the CLI.
2. The CLI creates the Auth user and upserts the `profiles` row.

```bash
pnpm db:admin -- --email maintainer@example.com --password Password1. --name "Maintainer Name" --role maintainer
```

### 7. Confirm The App Can Connect

1. Add the Supabase env vars to `.env.local`.
2. Restart the local server:

```bash
pnpm dev
```

3. Open `http://localhost:3000/admin/login`.
4. Sign in with the admin user.
5. Visit:
   - `/admin/content`
   - `/admin/projects`
   - `/admin/testimonials`
   - `/admin/media`
   - `/admin/users`

If you see the admin pages instead of being redirected back to login, Auth and profiles are connected.

### 8. Troubleshooting

- If login succeeds but `/admin` redirects to `/admin/login`, check that `profiles.id` exactly matches the Auth user's UID and that `role` is `admin` or `maintainer`.
- If API routes return `503`, check `DATABASE_URL` for app table access and `SUPABASE_SECRET_KEY` for Auth admin operations.
- If public pages show defaults, that is expected until database rows exist.
- If public project rows do not appear, check `projects.published = true`.
- If a maintainer cannot access `/admin/users`, that is expected. Only `admin` can manage users and roles.
- If SQL policies block dashboard testing, update `src/lib/db/schema.ts` and apply the change through Drizzle.

## Implementation Order

1. Add dependencies and environment variables for Supabase, Vercel Blob, and Playwright.
2. Add Supabase client/server helpers and proxy session handling.
3. Add `default-site-content.ts` and move current static data into default objects.
4. Add database query helpers with database-first/default-fallback behavior.
5. Update public landing sections to read through the content helpers.
6. Add protected admin layout, login page, dashboard shell, and RBAC helpers.
7. Add CRUD route handlers for content, projects, testimonials, assets, users, and contact messages.
8. Add Vercel Blob upload flow.
9. Add admin forms and tables.
10. Add Playwright config and E2E tests.
11. Run lint, build, and E2E tests.

## Environment Variables

Expected variables:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
DATABASE_URL=
BLOB_READ_WRITE_TOKEN=
BLOB_ACCESS=private
ADMIN_HOSTNAME=
NEXT_PUBLIC_SITE_URL=
```

`SUPABASE_SECRET_KEY` must only be used server-side.

Legacy fallback names supported by the implementation:

```txt
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Assumptions

- The admin is part of the same Next.js app, not a separate deployed app.
- Supabase handles authentication and Supabase Postgres stores editable content through Drizzle ORM.
- Vercel Blob stores uploaded images.
- Runtime fallback content is required even if a seed script is added later.
- The first implementation does not include drafts, approvals, scheduled publishing, visual page building, or multi-language editing.
