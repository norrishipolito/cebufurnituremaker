"use client";

import { motion } from "framer-motion";

interface CebuFurnitureMakerLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Cebu Furniture Maker Logo Component
 * 
 * Animated SVG logo featuring:
 * - SVG assemble animation: All elements animate in sequence on mount
 * - Staggered delays: Elements appear in logical order (circle → furniture → text)
 * - Path length animations: Stroke-based elements draw themselves
 * - Scale animations: Filled elements pop in
 * 
 * Animation sequence (total ~2 seconds):
 * 1. Circular emblem draws (0s)
 * 2. Vertical lines and pendant lights (0.2-0.6s)
 * 3. Picture frame and floor lamp (0.6-1s)
 * 4. Dresser with details (0.5-1.3s)
 * 5. Chair (1.1-1.3s)
 * 6. Plant (1.3-1.5s)
 * 7. Floor line (1.6s)
 * 8. Text elements fade in (1.8-2s)
 */
export function CebuFurnitureMakerLogo({
  className,
  width = 200,
  height = 120,
}: CebuFurnitureMakerLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circular Emblem */}
      <motion.circle
        cx="100"
        cy="50"
        r="45"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0 }}
      />
      
      {/* Vertical lines (curtains/blinds) on left */}
      <motion.line
        x1="60"
        y1="15"
        x2="60"
        y2="85"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.line
        x1="65"
        y1="15"
        x2="65"
        y2="85"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.line
        x1="70"
        y1="15"
        x2="70"
        y2="85"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.4 }}
      />
      
      {/* Dresser/Nightstand */}
      <motion.rect
        x="75"
        y="60"
        width="25"
        height="20"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.line
        x1="82"
        y1="60"
        x2="82"
        y2="80"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 0.7 }}
      />
      <motion.line
        x1="93"
        y1="60"
        x2="93"
        y2="80"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 0.8 }}
      />
      {/* Drawer handles */}
      <motion.circle
        cx="79"
        cy="67"
        r="1.5"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.9 }}
      />
      <motion.circle
        cx="79"
        cy="73"
        r="1.5"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 1 }}
      />
      {/* Legs */}
      <motion.line
        x1="77"
        y1="80"
        x2="77"
        y2="85"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut", delay: 1.1 }}
      />
      <motion.line
        x1="85"
        y1="80"
        x2="85"
        y2="85"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut", delay: 1.15 }}
      />
      <motion.line
        x1="93"
        y1="80"
        x2="93"
        y2="85"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut", delay: 1.2 }}
      />
      <motion.line
        x1="98"
        y1="80"
        x2="98"
        y2="85"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut", delay: 1.25 }}
      />
      
      {/* Potted plant on dresser */}
      <motion.path
        d="M 90 60 L 88 55 L 92 55 Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 1.3 }}
      />
      <motion.path
        d="M 90 60 L 86 58 L 94 58 Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 1.4 }}
      />
      <motion.rect
        x="88"
        y="60"
        width="4"
        height="2"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 1.5 }}
      />
      
      {/* Picture frame on wall */}
      <motion.rect
        x="105"
        y="25"
        width="12"
        height="12"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.6 }}
      />
      <motion.rect
        x="107"
        y="27"
        width="8"
        height="8"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 0.9 }}
      />
      
      {/* Chair */}
      <motion.rect
        x="120"
        y="65"
        width="12"
        height="2"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 1.1 }}
      />
      <motion.line
        x1="120"
        y1="65"
        x2="120"
        y2="85"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 1.2 }}
      />
      <motion.line
        x1="132"
        y1="65"
        x2="132"
        y2="85"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 1.25 }}
      />
      <motion.line
        x1="120"
        y1="85"
        x2="132"
        y2="85"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 1.3 }}
      />
      
      {/* Floor lamp */}
      <motion.line
        x1="138"
        y1="15"
        x2="138"
        y2="85"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut", delay: 0.7 }}
      />
      <motion.rect
        x="135"
        y="15"
        width="6"
        height="4"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 1 }}
      />
      
      {/* Pendant lights */}
      <motion.line
        x1="80"
        y1="15"
        x2="80"
        y2="20"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.rect
        x="77"
        y="20"
        width="6"
        height="3"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 0.6 }}
      />
      <motion.line
        x1="110"
        y1="15"
        x2="110"
        y2="20"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut", delay: 0.55 }}
      />
      <motion.path
        d="M 107 20 L 110 23 L 113 20"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 0.65 }}
      />
      
      {/* Floor line */}
      <motion.line
        x1="55"
        y1="85"
        x2="145"
        y2="85"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 1.6 }}
      />
      
      {/* Company Name */}
      <motion.text
        x="100"
        y="105"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="13"
        fontWeight="bold"
        textAnchor="middle"
        fill="currentColor"
        letterSpacing="1.5px"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 1.8 }}
      >
        CEBU FURNITURE MAKER
      </motion.text>
      
      {/* Slogan */}
      <motion.text
        x="100"
        y="118"
        fontFamily="Brush Script MT, Brush Script, cursive"
        fontSize="11"
        textAnchor="middle"
        fill="currentColor"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 2 }}
      >
        &ldquo;Your home deserve&apos;s the best&rdquo;
      </motion.text>
    </svg>
  );
}

