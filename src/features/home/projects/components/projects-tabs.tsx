"use client";

import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectsTabsProps {
  activeTab: string;
  groups: Array<{ value: string; label: string }>;
  onTabChange: (value: string) => void;
}

export function ProjectsTabs({ activeTab, groups, onTabChange }: ProjectsTabsProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="flex justify-center mb-8 sm:mb-10 md:mb-12"
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className="mx-auto flex h-auto w-full max-w-2xl flex-wrap justify-center gap-2">
          {groups.map((group) => (
            <TabsTrigger key={group.value} value={group.value}>
              {group.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </motion.div>
  );
}
