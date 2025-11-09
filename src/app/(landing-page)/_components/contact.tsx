"use client";

import { ContactHeader } from "@/features/home/contact/components/contact-header";
import { ContactForm } from "@/features/home/contact/components/contact-form";
import { ContactInfo } from "@/features/home/contact/components/contact-info";

export function Contact() {
  return (
    <section className="flex min-h-screen w-full items-center justify-center py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-5xl w-full">
        <ContactHeader />
        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <div>
            <ContactForm />
          </div>
          <div>
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
}
