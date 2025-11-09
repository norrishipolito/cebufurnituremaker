"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface AboutShowcaseProps {
  image: string;
  title: string;
  description: string;
}

export function AboutShowcase({ image, title, description }: AboutShowcaseProps) {
  return (
    <motion.div
      className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 sm:gap-8 md:mt-12 lg:mt-16 lg:grid-cols-2 lg:gap-12 items-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="relative aspect-[4/3] overflow-hidden rounded-lg order-2 lg:order-1"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </motion.div>
      <motion.div
        className="space-y-3 sm:space-y-4 order-1 lg:order-2"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed sm:text-base">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}

