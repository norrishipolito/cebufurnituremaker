"use client";

import { motion } from "framer-motion";

export function HeroHeading() {
  return (
    <motion.h1
      className="mb-4 text-3xl font-bold tracking-tight text-white sm:mb-5 sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      Design furniture for{" "}
      <span className="italic font-normal">spaces that breathe.</span>
    </motion.h1>
  );
}

