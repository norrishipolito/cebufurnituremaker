"use client";

import { motion } from "framer-motion";

export function ContactHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="mb-8 max-w-3xl"
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl"
        initial={{ y: 20 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="text-sm text-gray-600 dark:text-gray-400 sm:text-base md:text-lg"
        initial={{ y: 20 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
}

