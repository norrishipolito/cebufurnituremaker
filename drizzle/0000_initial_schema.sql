CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blob_url" text NOT NULL,
	"blob_pathname" text NOT NULL,
	"alt_text" text NOT NULL,
	"content_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"inquiry" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "project_assets" (
	"project_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "project_assets_project_id_asset_id_pk" PRIMARY KEY("project_id","asset_id")
);
--> statement-breakpoint
ALTER TABLE "project_assets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"group" text NOT NULL,
	"primary_asset_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_sections" (
	"key" text PRIMARY KEY NOT NULL,
	"content" jsonb NOT NULL,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_sections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"quote" text NOT NULL,
	"avatar_asset_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "testimonials" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_uploaded_by_profiles_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_assets" ADD CONSTRAINT "project_assets_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_assets" ADD CONSTRAINT "project_assets_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_primary_asset_id_assets_id_fk" FOREIGN KEY ("primary_asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_sections" ADD CONSTRAINT "site_sections_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_avatar_asset_id_assets_id_fk" FOREIGN KEY ("avatar_asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Public assets are readable" ON "assets" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Admin users can manage assets" ON "assets" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
)) WITH CHECK (exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
));--> statement-breakpoint
CREATE POLICY "Admin users can read audit logs" ON "audit_logs" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
));--> statement-breakpoint
CREATE POLICY "Anyone can submit contact messages" ON "contact_messages" AS PERMISSIVE FOR INSERT TO "anon", "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Admin users can read contact messages" ON "contact_messages" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
));--> statement-breakpoint
CREATE POLICY "Profiles are readable by admin users" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
));--> statement-breakpoint
CREATE POLICY "Admin users can manage project assets" ON "project_assets" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
)) WITH CHECK (exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
));--> statement-breakpoint
CREATE POLICY "Published projects are publicly readable" ON "projects" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ("projects"."published" = true);--> statement-breakpoint
CREATE POLICY "Admin users can manage projects" ON "projects" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
)) WITH CHECK (exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
));--> statement-breakpoint
CREATE POLICY "Site sections are readable by admin users" ON "site_sections" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
));--> statement-breakpoint
CREATE POLICY "Admin users can manage site sections" ON "site_sections" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
)) WITH CHECK (exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
));--> statement-breakpoint
CREATE POLICY "Published testimonials are publicly readable" ON "testimonials" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ("testimonials"."published" = true);--> statement-breakpoint
CREATE POLICY "Admin users can manage testimonials" ON "testimonials" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
)) WITH CHECK (exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
));