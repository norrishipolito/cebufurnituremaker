# Repository Standards

## Architecture

- Follow `docs/00-application-architecture.md`.
- Follow `docs/01-component-architecture-rules.md`.
- Follow `docs/02-feature-implementation-rules.md`.
- Page-level route composition belongs in `src/app/**/_components/`.
- Reusable feature components belong in `src/features/**/components/`.
- Shared server/client utilities belong in `src/lib/`.
- Keep feature plans updated as implementation changes.

## Backend And Data

- Existing backend APIs use Next.js App Router route handlers.
- New backend-facing features may use tRPC when it improves typed client/server workflow.
- Keep route handlers for uploads, webhooks, auth callbacks, public asset delivery, and HTTP-specific endpoints.
- App database tables use Drizzle ORM. Do not add manual Supabase SQL setup for schema changes.
- Schema changes belong in `src/lib/db/schema.ts` and Drizzle migrations.
- `DATABASE_URL` is required for ORM-backed server reads and writes.
- Supabase uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY`.
- Legacy Supabase anon/service-role names are fallback only.
- Never expose `SUPABASE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, or `BLOB_READ_WRITE_TOKEN` to client-side code.

## Auth And Roles

- Admin access is role-based with `admin` and `maintainer`.
- Every admin page and admin route handler must enforce authentication and role authorization.
- Maintainers must not see or access admin-only Users or Settings areas.
- Admin route handlers must reject mismatched `Origin` headers before mutating data.

## Images And Assets

- Images use Vercel Blob through `BLOB_READ_WRITE_TOKEN`.
- `BLOB_ACCESS` must match the Blob store access mode.
- Private Blob reads must only serve registered image assets.
- Safe upload types are JPEG, PNG, WebP, and AVIF.
- Uploaded image content must match the declared safe image MIME type.
- Asset deletion must be blocked while an asset is attached to projects, testimonials, or project asset links.

