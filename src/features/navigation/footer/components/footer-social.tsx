"use client";

import { motion } from "framer-motion";

interface SocialLink {
  href: string;
  label: string;
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  );
}

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function TwitterLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M21.54 7.06c.01.2.01.4.01.6 0 6.1-4.61 13.13-13.04 13.13-2.59 0-5-.76-7.03-2.07.36.04.72.06 1.09.06 2.15 0 4.12-.73 5.69-1.97a4.6 4.6 0 0 1-4.28-3.2c.28.05.57.08.87.08.42 0 .83-.06 1.22-.17a4.62 4.62 0 0 1-3.68-4.53v-.06c.62.35 1.33.56 2.09.58a4.64 4.64 0 0 1-2.04-3.85c0-.85.23-1.65.62-2.34a13.03 13.03 0 0 0 9.46 4.82 4.78 4.78 0 0 1-.12-1.06 4.58 4.58 0 0 1 4.58-4.6c1.32 0 2.51.56 3.34 1.45a9.02 9.02 0 0 0 2.91-1.12 4.62 4.62 0 0 1-2.01 2.55A9.12 9.12 0 0 0 24 4.65a9.89 9.89 0 0 1-2.46 2.41Z" />
    </svg>
  );
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: FacebookLogo,
  instagram: InstagramLogo,
  twitter: TwitterLogo,
};

export function FooterSocial({ links }: { links: SocialLink[] }) {
  const visibleLinks = links.filter(
    (social) => social.href && socialIcons[social.label.toLowerCase()]
  );

  if (!visibleLinks.length) {
    return null;
  }

  return (
    <motion.div
      className="flex items-center justify-center gap-3 sm:gap-4"
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {visibleLinks.map((social) => {
        const Icon = socialIcons[social.label.toLowerCase()];

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

