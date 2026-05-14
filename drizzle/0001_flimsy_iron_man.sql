ALTER TABLE "assets" DROP CONSTRAINT IF EXISTS "assets_uploaded_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "assets" DROP CONSTRAINT IF EXISTS "assets_uploaded_by_fkey";
--> statement-breakpoint
ALTER TABLE "audit_logs" DROP CONSTRAINT IF EXISTS "audit_logs_actor_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "audit_logs" DROP CONSTRAINT IF EXISTS "audit_logs_actor_id_fkey";
--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "projects_created_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "projects_created_by_fkey";
--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "projects_updated_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "projects_updated_by_fkey";
--> statement-breakpoint
ALTER TABLE "site_sections" DROP CONSTRAINT IF EXISTS "site_sections_updated_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "site_sections" DROP CONSTRAINT IF EXISTS "site_sections_updated_by_fkey";
--> statement-breakpoint
ALTER TABLE "testimonials" DROP CONSTRAINT IF EXISTS "testimonials_created_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "testimonials" DROP CONSTRAINT IF EXISTS "testimonials_created_by_fkey";
--> statement-breakpoint
ALTER TABLE "testimonials" DROP CONSTRAINT IF EXISTS "testimonials_updated_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "testimonials" DROP CONSTRAINT IF EXISTS "testimonials_updated_by_fkey";
--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_uploaded_by_profiles_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_sections" ADD CONSTRAINT "site_sections_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
DO $$
declare
  profiles_auth_fk text;
begin
  for profiles_auth_fk in
    select fk_constraint.conname
    from pg_constraint fk_constraint
    join pg_class table_class on table_class.oid = fk_constraint.conrelid
    join pg_namespace table_namespace on table_namespace.oid = table_class.relnamespace
    where fk_constraint.contype = 'f'
      and table_namespace.nspname = 'public'
      and table_class.relname = 'profiles'
      and fk_constraint.confrelid = 'auth.users'::regclass
  loop
    execute format('alter table public.profiles drop constraint if exists %I', profiles_auth_fk);
  end loop;

  delete from public.profiles profile
  where not exists (
    select 1 from auth.users auth_user where auth_user.id = profile.id
  );

  alter table public.profiles
    add constraint profiles_id_auth_users_id_fk
    foreign key (id) references auth.users(id) on delete cascade;
end $$;
