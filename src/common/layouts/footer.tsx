import { FooterBrand } from "@/features/navigation/footer/components/footer-brand";
import { FooterColumn } from "@/features/navigation/footer/components/footer-column";
import { FooterSocial } from "@/features/navigation/footer/components/footer-social";
import { FooterBottom } from "@/features/navigation/footer/components/footer-bottom";
import { defaultSiteContent } from "@/lib/default-site-content";
import { getSiteSection } from "@/lib/site-content/queries";

interface FooterContent {
  brand: string;
  columns: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
}

function asFooterContent(content: unknown): FooterContent {
  const fallback = defaultSiteContent.footer;
  const fallbackContent = {
    brand: fallback.brand,
    columns: fallback.columns.map((column) => ({
      title: column.title,
      links: [...column.links],
    })),
  };

  if (!content || typeof content !== "object") {
    return fallbackContent;
  }

  const source = content as Partial<FooterContent>;
  const columns = Array.isArray(source.columns)
    ? source.columns
        .filter((column) => column && typeof column === "object")
        .map((column) => ({
          title: typeof column.title === "string" ? column.title : "",
          links: Array.isArray(column.links)
            ? column.links
                .filter((link) => link && typeof link === "object")
                .map((link) => ({
                  label: typeof link.label === "string" ? link.label : "",
                  href: typeof link.href === "string" ? link.href : "",
                }))
                .filter((link) => link.label && link.href)
            : [],
        }))
        .filter((column) => column.title && column.links.length)
    : fallbackContent.columns;

  return {
    brand: typeof source.brand === "string" ? source.brand : fallbackContent.brand,
    columns,
  };
}

export async function Footer() {
  const { content } = await getSiteSection("footer");
  const footer = asFooterContent(content);

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <FooterBrand description={footer.brand} />
            <FooterSocial />
          </div>
          {footer.columns.map((column, index) => (
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
