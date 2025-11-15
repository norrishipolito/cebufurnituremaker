"use client";

import { motion } from "framer-motion";

export function ProjectsHeader() {
  return (
    <motion.div
      className="text-center mb-8 sm:mb-10 md:mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4">
        Our Crafted Solid Wood Collection
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto sm:text-base md:text-lg px-4">
        Discover our handcrafted furniture pieces, each designed and built with
        precision and care in Cebu.
      </p>
    </motion.div>
  );
}
