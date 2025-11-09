"use client";

import { motion } from "framer-motion";
import { CebuFurnitureMakerLogo } from "@/components/logo/cebu-furniture-maker-logo";

export function HeroLogo() {
  return (
    <motion.div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-20 sm:top-6 md:top-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <CebuFurnitureMakerLogo
        width={120}
        height={72}
        className="text-white sm:w-[140px] sm:h-[84px] md:w-[160px] md:h-[96px] lg:w-[180px] lg:h-[108px]"
      />
    </motion.div>
  );
}

