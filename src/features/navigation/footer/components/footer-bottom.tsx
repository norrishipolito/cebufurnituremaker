"use client";

import { motion } from "framer-motion";

export function FooterBottom() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.div
      className="mt-8 pt-6 sm:mt-10 sm:pt-7 md:mt-12 md:pt-8 border-t border-gray-200 dark:border-gray-800"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
          © {currentYear} Cebu Furniture Maker. All rights reserved.
        </p>
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <a
            href="/privacy"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </motion.div>
  );
}

