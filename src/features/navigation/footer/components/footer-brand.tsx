"use client";

import { motion } from "framer-motion";
import { CebuFurnitureMakerLogo } from "@/components/logo/cebu-furniture-maker-logo";

export function FooterBrand() {
  return (
    <motion.div
      className="mb-4 sm:mb-5 md:mb-6 flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-3 sm:mb-4 flex justify-center">
        <CebuFurnitureMakerLogo
          width={120}
          height={72}
          className="text-gray-900 dark:text-gray-100 sm:w-[140px] sm:h-[84px] md:w-[160px] md:h-[96px]"
        />
      </div>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto px-2">
        Handcrafted furniture designed and built in Cebu, Philippines. Creating timeless pieces for modern living.
      </p>
    </motion.div>
  );
}

