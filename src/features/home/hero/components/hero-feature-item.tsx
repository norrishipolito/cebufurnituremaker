"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface HeroFeatureItemProps {
  icon: LucideIcon;
  text: string;
  initialX?: number;
  initialY?: number;
  delay: number;
}

export function HeroFeatureItem({
  icon: Icon,
  text,
  initialX = 0,
  initialY = 0,
  delay,
}: HeroFeatureItemProps) {
  return (
    <motion.div
      className="flex items-center gap-2 text-white sm:gap-3"
      initial={{ opacity: 0, x: initialX, y: initialY }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay }}
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      <span className="text-xs font-medium sm:text-sm md:text-base">{text}</span>
    </motion.div>
  );
}

