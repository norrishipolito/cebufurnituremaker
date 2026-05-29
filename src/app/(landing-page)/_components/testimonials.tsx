import { TestimonialsHeader } from "@/features/home/testimonials/components/testimonials-header";
import { TestimonialsMarquee } from "@/features/home/testimonials/components/testimonials-marquee";
import { defaultTestimonialAvatar } from "@/lib/default-site-content";
import { getPublicTestimonials } from "@/lib/site-content/queries";

interface PublicTestimonialRow {
  img?: string;
  name: string;
  role: string;
  quote: string;
  avatar?: {
    blob_url?: string | null;
    blob_pathname?: string | null;
    alt_text?: string | null;
  } | null;
}

export async function Testimonials() {
  const { testimonials } = await getPublicTestimonials();
  const mappedTestimonials = (testimonials as PublicTestimonialRow[]).map(
    (testimonial) => ({
      img: testimonial.avatar?.blob_pathname
        ? `/api/blob/${testimonial.avatar.blob_pathname}`
        : testimonial.avatar?.blob_url ?? testimonial.img ?? defaultTestimonialAvatar,
      name: testimonial.name,
      role: testimonial.role,
      quote: testimonial.quote,
    })
  );

  return (
    <section id="testimonials" className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <TestimonialsHeader />
        <TestimonialsMarquee testimonials={mappedTestimonials} />
      </div>
    </section>
  );
}

