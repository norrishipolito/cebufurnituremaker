"use client";

import { motion } from "framer-motion";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

interface ContactInfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description: string;
  href?: string;
  delay: number;
}

function ContactInfoItem({
  icon: Icon,
  title,
  value,
  description,
  href,
  delay,
}: ContactInfoItemProps) {
  const content = (
    <>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-950/[.05] dark:bg-gray-50/[.12]">
        <Icon className="size-5 text-gray-900 dark:text-gray-100" />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-5 text-gray-600 dark:text-gray-400">
          {description}
        </p>
        <p className="mt-3 break-words text-sm font-medium text-gray-950 dark:text-gray-100">
          {value}
        </p>
      </div>
    </>
  );

  return (
    <motion.div
      className="rounded-lg bg-gray-950/[.03] p-4 transition-colors hover:bg-gray-950/[.05] dark:bg-gray-50/[.08] dark:hover:bg-gray-50/[.12]"
      initial={{ x: -20 }}
      whileInView={{ x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {href ? (
        <a href={href} className="flex items-start gap-4">
          {content}
        </a>
      ) : (
        <div className="flex items-start gap-4">{content}</div>
      )}
    </motion.div>
  );
}

export function ContactInfo({
  email,
  emailDescription,
  projectInquiryLabel,
  projectInquiryValue,
  projectInquiryDescription,
  phone,
  phoneDescription,
  address,
  addressDescription,
  hoursTitle,
  hours,
}: {
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
}) {
  return (
    <motion.div
      className="space-y-4"
      initial={false}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <ContactInfoItem
        icon={Mail}
        title="Email"
        value={email}
        description={emailDescription}
        href={`mailto:${email}`}
        delay={0.5}
      />
      <ContactInfoItem
        icon={MessageCircle}
        title={projectInquiryLabel}
        value={projectInquiryValue}
        description={projectInquiryDescription}
        delay={0.55}
      />
      <ContactInfoItem
        icon={Phone}
        title="Phone"
        value={phone}
        description={phoneDescription}
        href={`tel:${phone.replace(/[^\d+]/g, "")}`}
        delay={0.6}
      />
      <ContactInfoItem
        icon={MapPin}
        title="Address"
        value={address}
        description={addressDescription}
        delay={0.7}
      />
      <div className="rounded-lg bg-gray-950/[.03] p-4 dark:bg-gray-50/[.08]">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-950/[.05] dark:bg-gray-50/[.12]">
            <Clock className="size-5 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {hoursTitle}
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
              {hours}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

