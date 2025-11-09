"use client";

import { motion } from "framer-motion";
import { Truck, Rocket, Shield } from "lucide-react";
import { HeroFeatureItem } from "./hero-feature-item";

export function HeroFooterBar() {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-20 bg-black/60 backdrop-blur-sm border-t border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-around sm:gap-6">
          <HeroFeatureItem
            icon={Truck}
            text="Free shipping"
            initialX={-20}
            delay={0.8}
          />
          <HeroFeatureItem
            icon={Rocket}
            text="Delivered in 6 weeks"
            initialY={20}
            delay={0.9}
          />
          <HeroFeatureItem
            icon={Shield}
            text="Lifetime guarantee"
            initialX={20}
            delay={1.0}
          />
        </div>
      </div>
    </motion.div>
  );
}

