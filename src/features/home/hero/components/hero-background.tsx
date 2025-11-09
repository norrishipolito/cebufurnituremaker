"use client";

import { motion, MotionValue } from "framer-motion";
import Image from "next/image";

interface HeroBackgroundProps {
  backgroundY: MotionValue<number>;
}

export function HeroBackground({ backgroundY }: HeroBackgroundProps) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ y: backgroundY }}
    >
      <div className="relative h-[120%] w-full">
        {/* 
          To use the actual KATACHI background image:
          1. Download the image from the KATACHI template
          2. Save it as /public/images/katachi-hero-bg.jpg
          3. Or replace the src below with the direct image URL
        */}
        <Image
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2070&auto=format&fit=crop"
          alt="Modern interior with window view of dramatic landscape"
          fill
          priority
          className="object-cover"
          quality={90}
          sizes="100vw"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        {/* Subtle blur at edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
      </div>
    </motion.div>
  );
}

