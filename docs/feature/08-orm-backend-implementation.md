# ORM Backend Implementation

## Summary

The backend database layer now uses Drizzle ORM for Supabase Postgres. Supabase still handles Auth sessions and Auth user management, but app tables are defined in TypeScript and updated through Drizzle commands instead of manually running SQL in the Supabase dashboard.

Chosen stack:

- ORM: Drizzle ORM.
- Migration tool: Drizzle Kit.
- Postgres driver: `postgres`.
- Database: Supabase Postgres.
- Auth: Supabase Auth.

## File Architecture

```txt
drizzle/
|-- 0000_initial_schema.sql
`-- meta/
    |-- 0000_snapshot.json
    `-- _journal.json

drizzle.config.ts

scripts/
`-- upsert-admin.ts

src/
`-- lib/
    |-- db/
    |   |-- client.ts
    |   `-- schema.ts
    |-- site-content/
    |   |-- queries.ts
    |   `-- mutations.ts
    `-- supabase/
        |-- client.ts
        |-- middleware.ts
        `-- server.ts
```

## Environment Variables

Add this server-only variable:

```txt
DATABASE_URL=
```

Keep the existing Supabase Auth variables:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

`DATABASE_URL`, `SUPABASE_SECRET_KEY`, and `BLOB_READ_WRITE_TOKEN` must never be exposed to browser code.

## Getting DATABASE_URL From Supabase

1. Open https://supabase.com/dashboard.
2. Open your project.
3. Click `Connect` in the top bar.
4. Choose an app framework option that shows a Postgres connection string, or open `Project Settings` -> `Database`.
5. Prefer the pooler connection string for deployed/serverless environments.
6. Copy the URI connection string into `.env.local` as `DATABASE_URL`.
7. Replace `[YOUR-PASSWORD]` with your database password.
8. If your password has special characters, URL-encode it.

Example shape:

```txt
DATABASE_URL=postgresql://postgres.your-ref:your-password@aws-0-region.pooler.supabase.com:6543/postgres
```

If `pnpm db:push` fails with `getaddrinfo ENOTFOUND db.<project-ref>.supabase.co`, replace the direct database URL with the Supabase pooler URL from the `Connect` flow. The pooler host usually looks like `aws-0-region.pooler.supabase.com`, and the username is usually `postgres.<project-ref>`.

Prefer the session pooler when Supabase offers it. The transaction pooler also works for this app because the Postgres driver is configured with prepared statements disabled.

## Commands

Generate a migration after changing `src/lib/db/schema.ts`:

```bash
pnpm db:generate
```

Apply migrations to a fresh database:

```bash
pnpm db:migrate
```

Sync the TypeScript schema to an existing Supabase database:

```bash
pnpm db:push
```

Use `db:push` for the current project because tables may already exist from the earlier manual SQL setup. This should also apply schema drift such as removing the old fixed `projects.group` constraint.

Open Drizzle Studio:

```bash
pnpm db:studio
```

Create the first admin user and matching profile without dashboard SQL:

```bash
pnpm db:admin -- --email you@example.com --password Password1. --name "Your Name" --role admin
```

## Implementation Rules

- New tables and columns must be added to `src/lib/db/schema.ts`.
- Do not add manual Supabase SQL setup steps for app tables.
- Use Drizzle migrations or `db:push` for schema changes.
- Keep Supabase Auth operations in the Supabase client.
- Keep app table reads/writes in Drizzle.
- Log backend write failures with `src/lib/api/logger.ts` through `jsonError` context so failed admin actions are diagnosable from the server terminal.
- Do not log raw SQL params, passwords, tokens, or other secrets.
- Public content still needs runtime defaults for an empty database.
- Route handlers still enforce RBAC server-side.

## Current ORM Coverage

Drizzle now manages:

- `profiles`
- `site_sections`
- `assets`
- `projects`
- `project_assets`
- `testimonials`
- `contact_messages`
- `audit_logs`

Supabase still manages:

- Auth users
- Auth sessions
- Auth cookies/session refresh

Admin user CRUD uses both systems:

- Supabase Auth Admin creates, updates email/password metadata, and deletes auth users.
- Drizzle writes the matching `profiles` row and role.
- Admin routes must block self deletion, self role changes, and removal of the last remaining `admin`.

## Verification

After changing database code:

```bash
pnpm lint
pnpm build
pnpm test:e2e
```

`pnpm test:e2e` requires `DATABASE_URL` to be configured because admin role lookup now reads `profiles` through Drizzle.

## Bug Regression Rule

Every user-reported backend or admin bug must get a regression test when feasible. For example, the project form reset bug is covered by an admin UI test that creates a project through `/admin/projects` and asserts the success state instead of the previous `Cannot read properties of null (reading 'reset')` failure.
