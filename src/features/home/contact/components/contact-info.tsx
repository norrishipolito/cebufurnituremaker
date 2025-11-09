"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactInfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  delay: number;
}

function ContactInfoItem({ icon: Icon, title, value, delay }: ContactInfoItemProps) {
  return (
    <motion.div
      className="flex items-start gap-3 sm:gap-4"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
      </div>
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          {title}
        </h3>
        <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white break-words">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

export function ContactInfo() {
  return (
    <motion.div
      className="space-y-4 sm:space-y-5 md:space-y-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <ContactInfoItem
        icon={Mail}
        title="Email"
        value="info@cebufurnituremaker.com"
        delay={0.5}
      />
      <ContactInfoItem
        icon={Phone}
        title="Phone"
        value="+63 32 123 4567"
        delay={0.6}
      />
      <ContactInfoItem
        icon={MapPin}
        title="Address"
        value="Cebu City, Philippines"
        delay={0.7}
      />
    </motion.div>
  );
}

