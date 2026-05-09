import { ContactHeader } from "@/features/home/contact/components/contact-header";
import { ContactForm } from "@/features/home/contact/components/contact-form";
import { ContactInfo } from "@/features/home/contact/components/contact-info";
import { defaultSiteContent } from "@/lib/default-site-content";
import { getSiteSection } from "@/lib/site-content/queries";

interface ContactSectionContent {
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

function asContactContent(content: unknown): ContactSectionContent {
  const fallback = defaultSiteContent.contact;

  if (!content || typeof content !== "object") {
    return fallback;
  }

  const source = content as Partial<ContactSectionContent>;

  return {
    title: typeof source.title === "string" ? source.title : fallback.title,
    description:
      typeof source.description === "string"
        ? source.description
        : fallback.description,
    email: typeof source.email === "string" ? source.email : fallback.email,
    phone: typeof source.phone === "string" ? source.phone : fallback.phone,
    address:
      typeof source.address === "string" ? source.address : fallback.address,
  };
}

export async function Contact() {
  const { content } = await getSiteSection("contact");
  const contact = asContactContent(content);

  return (
    <section
      id="contact"
      className="flex min-h-screen w-full items-center justify-center py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 bg-white dark:bg-gray-950"
    >
      <div className="mx-auto max-w-5xl w-full">
        <ContactHeader title={contact.title} description={contact.description} />
        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <div>
            <ContactForm />
          </div>
          <div>
            <ContactInfo
              email={contact.email}
              phone={contact.phone}
              address={contact.address}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
