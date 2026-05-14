import { redirect } from "next/navigation";
import { AdminPageShell } from "../../_components/admin-page-shell";
import { getCurrentAdminProfile } from "@/lib/auth/require-admin";
import { defaultSiteContent } from "@/lib/default-site-content";
import {
  TestimonialManager,
  type AdminTestimonial,
} from "@/features/admin/testimonials/components/testimonial-manager";
import { createDbClient } from "@/lib/db/client";
import { testimonials as testimonialsTable } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export default async function AdminTestimonialsPage() {
  const auth = await getCurrentAdminProfile();

  if (!auth) {
    redirect("/admin/login");
  }

  const db = createDbClient();
  const data = db
    ? await db
        .select()
        .from(testimonialsTable)
        .orderBy(asc(testimonialsTable.sort_order))
    : null;
  const source = data?.length ? "database" : "default";
  const testimonials: AdminTestimonial[] = data?.length
    ? data.map((testimonial) => ({ ...testimonial, editable: true }))
    : defaultSiteContent.testimonials.map((testimonial) => ({
        id: testimonial.id,
        name: testimonial.name,
        role: testimonial.role,
        quote: testimonial.quote,
        sort_order: testimonial.sortOrder,
        published: testimonial.published,
        editable: false,
      }));

  return (
    <AdminPageShell
      title="Testimonials"
      description="Create and review editable testimonials. Defaults appear while the database is empty."
    >
      <TestimonialManager initialTestimonials={testimonials} source={source} />
    </AdminPageShell>
  );
}
