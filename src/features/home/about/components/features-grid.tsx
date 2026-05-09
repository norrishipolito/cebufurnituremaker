"use client";

import {
  Award,
  Hammer,
  Heart,
  Leaf,
  Shield,
  Users,
} from "lucide-react";
import { FeatureCard } from "./feature-card";

const iconMap = {
  Award,
  Hammer,
  Heart,
  Leaf,
  Shield,
  Users,
};

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesGridProps {
  features: Feature[];
}

export function FeaturesGrid({ features }: FeaturesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => {
        const Icon = iconMap[feature.icon as keyof typeof iconMap] ?? Shield;

        return (
          <FeatureCard
            key={feature.title}
            icon={Icon}
            title={feature.title}
            description={feature.description}
            index={index}
          />
        );
      })}
    </div>
  );
}

