import { z } from "zod";

export const projectGroupSchema = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-zA-Z0-9][a-zA-Z0-9 _-]*$/);

export const siteSectionKeySchema = z.enum([
  "hero",
  "about",
  "contact",
  "footer",
]);

export const siteSectionSchema = z.record(z.string(), z.unknown());

export const projectInputSchema = z.object({
  slug: z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(2).max(160),
  description: z.string().min(2).max(1200),
  category: z.string().min(2).max(80),
  group: projectGroupSchema.default("projects"),
  primary_asset_id: z.string().uuid().nullable().optional(),
  asset_ids: z.array(z.string().uuid()).max(12).optional(),
  sort_order: z.coerce.number().int().min(0).default(0),
  published: z.coerce.boolean().default(true),
});

export const testimonialInputSchema = z.object({
  name: z.string().min(2).max(120),
  role: z.string().min(2).max(120),
  quote: z.string().min(2).max(1000),
  avatar_asset_id: z.string().uuid().nullable().optional(),
  sort_order: z.coerce.number().int().min(0).default(0),
  published: z.coerce.boolean().default(true),
});

export const assetPatchSchema = z.object({
  alt_text: z.string().min(2).max(240),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(80).optional().or(z.literal("")),
  inquiry: z.string().max(120).optional().or(z.literal("")),
  message: z.string().min(2).max(2000),
});

export const rolePatchSchema = z.object({
  role: z.enum(["admin", "maintainer"]),
});

export const createUserSchema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(8).max(160),
  display_name: z.string().max(120).optional().or(z.literal("")),
  role: z.enum(["admin", "maintainer"]),
});

export const updateUserSchema = z.object({
  email: z.string().email().max(160).optional(),
  password: z.string().min(8).max(160).optional().or(z.literal("")),
  display_name: z.string().max(120).optional().or(z.literal("")),
  role: z.enum(["admin", "maintainer"]).optional(),
});
