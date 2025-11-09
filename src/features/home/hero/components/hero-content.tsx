"use client";

import { motion, MotionValue } from "framer-motion";
import { HeroHeading } from "./hero-heading";
import { HeroTagline } from "./hero-tagline";

interface HeroContentProps {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}

export function HeroContent({ opacity, scale }: HeroContentProps) {
  return (
    <motion.div
      className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
      style={{ opacity, scale }}
    >
      <HeroHeading />
      <HeroTagline />
    </motion.div>
  );
}

