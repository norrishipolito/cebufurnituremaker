"use client";

import { motion } from "framer-motion";
import { Rocket, Shield, Truck } from "lucide-react";
import { HeroFeatureItem } from "./hero-feature-item";

const iconMap = {
  Rocket,
  Shield,
  Truck,
};

interface HeroFooterBarProps {
  features: Array<{
    icon: string;
    text: string;
  }>;
}

export function HeroFooterBar({ features }: HeroFooterBarProps) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-20 bg-black/60 backdrop-blur-sm border-t border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-around sm:gap-6">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap] ?? Shield;

            return (
              <HeroFeatureItem
                key={`${feature.text}-${index}`}
                icon={Icon}
                text={feature.text}
                initialX={index === 0 ? -20 : index === 2 ? 20 : undefined}
                initialY={index === 1 ? 20 : undefined}
                delay={0.8 + index * 0.1}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
