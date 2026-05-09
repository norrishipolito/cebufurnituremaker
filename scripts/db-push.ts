import { existsSync, readFileSync } from "node:fs";
import postgres from "postgres";

function loadEnvFile(path: string) {
  if (!existsSync(path)) {
    return;
  }

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    process.env[key] ??= value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing.");
}

const statements = [
  `create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    display_name text,
    role text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,
  `create table if not exists public.site_sections (
    key text primary key,
    content jsonb not null,
    updated_by uuid references public.profiles(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,
  `create table if not exists public.assets (
    id uuid primary key default gen_random_uuid(),
    blob_url text not null,
    blob_pathname text not null,
    alt_text text not null,
    content_type text not null,
    size_bytes integer not null,
    uploaded_by uuid references public.profiles(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,
  `create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    title text not null,
    description text not null,
    category text not null,
    "group" text not null,
    primary_asset_id uuid references public.assets(id),
    sort_order integer not null default 0,
    published boolean not null default true,
    created_by uuid references public.profiles(id),
    updated_by uuid references public.profiles(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,
  `create table if not exists public.project_assets (
    project_id uuid not null references public.projects(id) on delete cascade,
    asset_id uuid not null references public.assets(id) on delete cascade,
    sort_order integer not null default 0,
    primary key (project_id, asset_id)
  )`,
  `create table if not exists public.testimonials (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    role text not null,
    quote text not null,
    avatar_asset_id uuid references public.assets(id),
    sort_order integer not null default 0,
    published boolean not null default true,
    created_by uuid references public.profiles(id),
    updated_by uuid references public.profiles(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,
  `create table if not exists public.contact_messages (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    phone text,
    inquiry text,
    message text not null,
    status text not null default 'new',
    created_at timestamptz not null default now()
  )`,
  `create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    actor_id uuid references public.profiles(id),
    action text not null,
    entity_type text not null,
    entity_id text,
    metadata jsonb,
    created_at timestamptz not null default now()
  )`,
  `alter table public.profiles add column if not exists email text`,
  `alter table public.profiles add column if not exists display_name text`,
  `alter table public.profiles add column if not exists role text`,
  `alter table public.profiles add column if not exists created_at timestamptz not null default now()`,
  `alter table public.profiles add column if not exists updated_at timestamptz not null default now()`,
  `alter table public.projects drop constraint if exists projects_group_check`,
  `alter table public.profiles drop constraint if exists profiles_role_check`,
  `alter table public.profiles enable row level security`,
  `alter table public.site_sections enable row level security`,
  `alter table public.assets enable row level security`,
  `alter table public.projects enable row level security`,
  `alter table public.project_assets enable row level security`,
  `alter table public.testimonials enable row level security`,
  `alter table public.contact_messages enable row level security`,
  `alter table public.audit_logs enable row level security`,
];

const policyStatements = [
  [`profiles`, `Profiles are readable by admin users`, `for select to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'maintainer')
  ))`],
  [`site_sections`, `Site sections are readable by admin users`, `for select to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'maintainer')
  ))`],
  [`site_sections`, `Admin users can manage site sections`, `for all to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'maintainer')
  )) with check (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'maintainer')
  ))`],
  [`assets`, `Public assets are readable`, `for select to anon, authenticated using (true)`],
  [`assets`, `Admin users can manage assets`, `for all to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'maintainer')
  )) with check (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'maintainer')
  ))`],
  [`projects`, `Published projects are publicly readable`, `for select to anon, authenticated using (published = true)`],
  [`projects`, `Admin users can manage projects`, `for all to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'maintainer')
  )) with check (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'maintainer')
  ))`],
  [`project_assets`, `Admin users can manage project assets`, `for all to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'maintainer')
  )) with check (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'maintainer')
  ))`],
  [`testimonials`, `Published testimonials are publicly readable`, `for select to anon, authenticated using (published = true)`],
  [`testimonials`, `Admin users can manage testimonials`, `for all to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'maintainer')
  )) with check (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'maintainer')
  ))`],
  [`contact_messages`, `Anyone can submit contact messages`, `for insert to anon, authenticated with check (true)`],
  [`contact_messages`, `Admin users can read contact messages`, `for select to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'maintainer')
  ))`],
  [`audit_logs`, `Admin users can read audit logs`, `for select to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'maintainer')
  ))`],
] as const;

const sql = postgres(process.env.DATABASE_URL, {
  prepare: false,
  ssl: "require",
});

async function main() {
  for (const statement of statements) {
    await sql.unsafe(statement);
  }

  for (const [table, policyName, definition] of policyStatements) {
    await sql.unsafe(`drop policy if exists "${policyName}" on public.${table}`);
    await sql.unsafe(`create policy "${policyName}" on public.${table} ${definition}`);
  }

  console.log("Database schema is synced.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sql.end();
  });
