"use client";

import { FooterBrand } from "@/features/navigation/footer/components/footer-brand";
import { FooterColumn } from "@/features/navigation/footer/components/footer-column";
import { FooterSocial } from "@/features/navigation/footer/components/footer-social";
import { FooterBottom } from "@/features/navigation/footer/components/footer-bottom";
import { footerColumns } from "@/features/navigation/footer/components/footer-data";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <FooterBrand />
            <FooterSocial />
          </div>
          {footerColumns.map((column, index) => (
            <FooterColumn
              key={column.title}
              title={column.title}
              links={column.links}
              delay={0.1 * (index + 1)}
            />
          ))}
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}

