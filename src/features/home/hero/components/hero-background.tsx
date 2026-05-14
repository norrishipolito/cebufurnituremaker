"use client";

import { motion, MotionValue } from "framer-motion";
import Image from "next/image";

interface HeroBackgroundProps {
  backgroundY: MotionValue<number>;
  image: string;
  alt: string;
}

export function HeroBackground({ backgroundY, image, alt }: HeroBackgroundProps) {
  return (
    <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
      <div className="relative h-[120%] w-full">
        {image ? (
          <Image
            src={image}
            alt={alt}
            fill
            priority
            className="object-cover"
            quality={90}
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-neutral-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
      </div>
    </motion.div>
  );
}
