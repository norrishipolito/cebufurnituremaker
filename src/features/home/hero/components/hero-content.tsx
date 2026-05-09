"use client";

import { motion, MotionValue } from "framer-motion";
import { HeroHeading } from "./hero-heading";
import { HeroTagline } from "./hero-tagline";

interface HeroContentProps {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  heading: string;
  emphasizedHeading: string;
  tagline: string;
}

export function HeroContent({
  opacity,
  scale,
  heading,
  emphasizedHeading,
  tagline,
}: HeroContentProps) {
  return (
    <motion.div
      className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
      style={{ opacity, scale }}
    >
      <HeroHeading heading={heading} emphasizedHeading={emphasizedHeading} />
      <HeroTagline tagline={tagline} />
    </motion.div>
  );
}
