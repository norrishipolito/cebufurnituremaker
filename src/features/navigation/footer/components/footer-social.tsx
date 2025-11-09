"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Facebook, Instagram } from "lucide-react";

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  {
    icon: Facebook,
    href: "https://facebook.com/cebufurnituremaker",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "https://instagram.com/cebufurnituremaker",
    label: "Instagram",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/cebufurnituremaker",
    label: "Twitter",
  },
  {
    icon: Github,
    href: "https://github.com/cebufurnituremaker",
    label: "GitHub",
  },
];

export function FooterSocial() {
  return (
    <motion.div
      className="flex items-center justify-center gap-3 sm:gap-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </a>
        );
      })}
    </motion.div>
  );
}

