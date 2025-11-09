"use client";

import { motion } from "framer-motion";

export function HeroTagline() {
  return (
    <motion.p
      className="mx-auto mb-8 max-w-2xl text-sm leading-7 text-white/90 sm:mb-10 sm:text-base sm:leading-8 md:mb-12 md:text-lg lg:text-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      Designed in Cebu, crafted to endure — timeless pieces for modern living.
    </motion.p>
  );
}

