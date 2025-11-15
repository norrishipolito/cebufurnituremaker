"use client";

import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductType } from "./projects-data";

interface ProjectsTabsProps {
  activeTab: ProductType;
  onTabChange: (value: ProductType) => void;
}

export function ProjectsTabs({ activeTab, onTabChange }: ProjectsTabsProps) {
  return (
    <motion.div
      className="flex justify-center mb-8 sm:mb-10 md:mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as ProductType)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="Set">Products</TabsTrigger>
          <TabsTrigger value="Collection">Showroom</TabsTrigger>
          <TabsTrigger value="Suites">Fabrication Site</TabsTrigger>
        </TabsList>
      </Tabs>
    </motion.div>
  );
}
