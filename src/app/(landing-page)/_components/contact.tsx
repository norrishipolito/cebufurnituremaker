import { ContactHeader } from "@/features/home/contact/components/contact-header";
import { ContactForm } from "@/features/home/contact/components/contact-form";
import { ContactInfo } from "@/features/home/contact/components/contact-info";
import { defaultSiteContent } from "@/lib/default-site-content";
import { getSiteSection } from "@/lib/site-content/queries";

interface ContactSectionContent {
  title: string;
  description: string;
  email: string;
  emailDescription: string;
  projectInquiryLabel: string;
  projectInquiryValue: string;
  projectInquiryDescription: string;
  phone: string;
  phoneDescription: string;
  address: string;
  addressDescription: string;
  hoursTitle: string;
  hours: string;
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
    emailDescription:
      typeof source.emailDescription === "string"
        ? source.emailDescription
        : fallback.emailDescription,
    projectInquiryLabel:
      typeof source.projectInquiryLabel === "string"
        ? source.projectInquiryLabel
        : fallback.projectInquiryLabel,
    projectInquiryValue:
      typeof source.projectInquiryValue === "string"
        ? source.projectInquiryValue
        : fallback.projectInquiryValue,
    projectInquiryDescription:
      typeof source.projectInquiryDescription === "string"
        ? source.projectInquiryDescription
        : fallback.projectInquiryDescription,
    phone: typeof source.phone === "string" ? source.phone : fallback.phone,
    phoneDescription:
      typeof source.phoneDescription === "string"
        ? source.phoneDescription
        : fallback.phoneDescription,
    address:
      typeof source.address === "string" ? source.address : fallback.address,
    addressDescription:
      typeof source.addressDescription === "string"
        ? source.addressDescription
        : fallback.addressDescription,
    hoursTitle:
      typeof source.hoursTitle === "string" ? source.hoursTitle : fallback.hoursTitle,
    hours: typeof source.hours === "string" ? source.hours : fallback.hours,
  };
}

export async function Contact() {
  const { content } = await getSiteSection("contact");
  const contact = asContactContent(content);

  return (
    <section
      id="contact"
      className="flex min-h-screen w-full items-center justify-center bg-white px-4 py-12 dark:bg-gray-950 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <ContactHeader title={contact.title} description={contact.description} />
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)] lg:gap-10">
          <aside>
            <ContactInfo
              email={contact.email}
              emailDescription={contact.emailDescription}
              projectInquiryLabel={contact.projectInquiryLabel}
              projectInquiryValue={contact.projectInquiryValue}
              projectInquiryDescription={contact.projectInquiryDescription}
              phone={contact.phone}
              phoneDescription={contact.phoneDescription}
              address={contact.address}
              addressDescription={contact.addressDescription}
              hoursTitle={contact.hoursTitle}
              hours={contact.hours}
            />
          </aside>
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
