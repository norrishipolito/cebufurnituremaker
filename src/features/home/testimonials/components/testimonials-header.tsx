"use client";

import { motion } from "framer-motion";

export function TestimonialsHeader() {
  return (
    <motion.div
      className="text-center mb-8 sm:mb-10 md:mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        What Our Customers Say
      </motion.h2>
      <motion.p
        className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto sm:text-base md:text-lg px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Don't just take our word for it. Here's what our satisfied customers have to say about our handcrafted furniture.
      </motion.p>
    </motion.div>
  );
}

