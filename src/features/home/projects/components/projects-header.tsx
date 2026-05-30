"use client";

import { motion } from "framer-motion";

export function ProjectsHeader({ projectCount }: { projectCount: number }) {
  return (
    <motion.div
      className="mx-auto mb-8 grid max-w-6xl gap-5 sm:mb-10 md:mb-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center lg:text-left">
        <p className="mb-2 text-xs font-semibold uppercase text-amber-700 dark:text-amber-300">
          Projects
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl">
          Crafted furniture, built for real spaces
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-400 sm:text-base md:text-lg lg:mx-0">
          Browse finished work and workshop-ready pieces designed with solid
          wood, balanced proportions, and Cebu craftsmanship.
        </p>
      </div>
      <div className="mx-auto inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 lg:mx-0">
        {projectCount} {projectCount === 1 ? "project" : "projects"}
      </div>
    </motion.div>
  );
}
