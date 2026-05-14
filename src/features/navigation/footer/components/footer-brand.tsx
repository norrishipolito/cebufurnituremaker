"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CebuFurnitureMakerLogo } from "@/components/logo/cebu-furniture-maker-logo";

/**
 * Footer Brand Component
 * 
 * Displays the logo in the footer with:
 * - Viewport-triggered animation (logo animates when footer comes into view)
 * - SVG assemble animation on the logo
 * - Company description text
 * 
 * The logo only renders when the footer is in view to ensure
 * the SVG animation plays when the user sees it.
 */
export function FooterBrand({ description }: { description: string }) {
  const ref = useRef(null);
  const hasAnimated = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="mb-4 sm:mb-5 md:mb-6 flex flex-col items-center text-center"
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-3 sm:mb-4 flex justify-center">
        {hasAnimated ? (
          <CebuFurnitureMakerLogo
            width={120}
            height={72}
            className="text-gray-900 dark:text-gray-100 sm:w-[140px] sm:h-[84px] md:w-[160px] md:h-[96px]"
          />
        ) : null}
      </div>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto px-2">
        {description}
      </p>
    </motion.div>
  );
}

