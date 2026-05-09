import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgPolicy,
  pgRole,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const anonRole = pgRole("anon").existing();
const authenticatedRole = pgRole("authenticated").existing();

const adminOrMaintainer = sql`exists (
  select 1
  from public.profiles
  where profiles.id = auth.uid()
    and profiles.role in ('admin', 'maintainer')
)`;

const timestamps = {
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    email: text("email").notNull(),
    display_name: text("display_name"),
    role: text("role").notNull(),
    ...timestamps,
  },
  () => [
    pgPolicy("Profiles are readable by admin users", {
      for: "select",
      to: authenticatedRole,
      using: adminOrMaintainer,
    }),
  ]
).enableRLS();

export const siteSections = pgTable(
  "site_sections",
  {
    key: text("key").primaryKey(),
    content: jsonb("content").notNull().$type<unknown>(),
    updated_by: uuid("updated_by").references(() => profiles.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  () => [
    pgPolicy("Site sections are readable by admin users", {
      for: "select",
      to: authenticatedRole,
      using: adminOrMaintainer,
    }),
    pgPolicy("Admin users can manage site sections", {
      for: "all",
      to: authenticatedRole,
      using: adminOrMaintainer,
      withCheck: adminOrMaintainer,
    }),
  ]
).enableRLS();

export const assets = pgTable(
  "assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    blob_url: text("blob_url").notNull(),
    blob_pathname: text("blob_pathname").notNull(),
    alt_text: text("alt_text").notNull(),
    content_type: text("content_type").notNull(),
    size_bytes: integer("size_bytes").notNull(),
    uploaded_by: uuid("uploaded_by").references(() => profiles.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  () => [
    pgPolicy("Public assets are readable", {
      for: "select",
      to: [anonRole, authenticatedRole],
      using: sql`true`,
    }),
    pgPolicy("Admin users can manage assets", {
      for: "all",
      to: authenticatedRole,
      using: adminOrMaintainer,
      withCheck: adminOrMaintainer,
    }),
  ]
).enableRLS();

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    group: text("group").notNull(),
    primary_asset_id: uuid("primary_asset_id").references(() => assets.id),
    sort_order: integer("sort_order").notNull().default(0),
    published: boolean("published").notNull().default(true),
    created_by: uuid("created_by").references(() => profiles.id, {
      onDelete: "set null",
    }),
    updated_by: uuid("updated_by").references(() => profiles.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (table) => [
    pgPolicy("Published projects are publicly readable", {
      for: "select",
      to: [anonRole, authenticatedRole],
      using: sql`${table.published} = true`,
    }),
    pgPolicy("Admin users can manage projects", {
      for: "all",
      to: authenticatedRole,
      using: adminOrMaintainer,
      withCheck: adminOrMaintainer,
    }),
  ]
).enableRLS();

export const projectAssets = pgTable(
  "project_assets",
  {
    project_id: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    asset_id: uuid("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),
    sort_order: integer("sort_order").notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.project_id, table.asset_id] }),
    pgPolicy("Admin users can manage project assets", {
      for: "all",
      to: authenticatedRole,
      using: adminOrMaintainer,
      withCheck: adminOrMaintainer,
    }),
  ]
).enableRLS();

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    role: text("role").notNull(),
    quote: text("quote").notNull(),
    avatar_asset_id: uuid("avatar_asset_id").references(() => assets.id),
    sort_order: integer("sort_order").notNull().default(0),
    published: boolean("published").notNull().default(true),
    created_by: uuid("created_by").references(() => profiles.id, {
      onDelete: "set null",
    }),
    updated_by: uuid("updated_by").references(() => profiles.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (table) => [
    pgPolicy("Published testimonials are publicly readable", {
      for: "select",
      to: [anonRole, authenticatedRole],
      using: sql`${table.published} = true`,
    }),
    pgPolicy("Admin users can manage testimonials", {
      for: "all",
      to: authenticatedRole,
      using: adminOrMaintainer,
      withCheck: adminOrMaintainer,
    }),
  ]
).enableRLS();

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    inquiry: text("inquiry"),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  () => [
    pgPolicy("Anyone can submit contact messages", {
      for: "insert",
      to: [anonRole, authenticatedRole],
      withCheck: sql`true`,
    }),
    pgPolicy("Admin users can read contact messages", {
      for: "select",
      to: authenticatedRole,
      using: adminOrMaintainer,
    }),
  ]
).enableRLS();

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actor_id: uuid("actor_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    entity_type: text("entity_type").notNull(),
    entity_id: text("entity_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown> | null>(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  () => [
    pgPolicy("Admin users can read audit logs", {
      for: "select",
      to: authenticatedRole,
      using: adminOrMaintainer,
    }),
  ]
).enableRLS();
