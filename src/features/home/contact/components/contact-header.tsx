"use client";

import { motion } from "framer-motion";

export function ContactHeader() {
  return (
    <motion.div
      className="text-center mb-6 sm:mb-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Get in Touch
      </motion.h2>
      <motion.p
        className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto sm:text-base md:text-lg px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Have a project in mind? Let's discuss how we can bring your furniture vision to life.
      </motion.p>
    </motion.div>
  );
}

