import { AboutHeader } from "@/features/home/about/components/about-header";
import { FeaturesGrid } from "@/features/home/about/components/features-grid";
import { AboutShowcase } from "@/features/home/about/components/about-showcase";
import { defaultSiteContent } from "@/lib/default-site-content";
import { getSiteSection } from "@/lib/site-content/queries";

interface AboutSectionContent {
  title: string;
  description: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  showcase: {
    image: string;
    title: string;
    description: string;
  };
}

function asAboutContent(content: unknown): AboutSectionContent {
  const fallback = defaultSiteContent.about;
  const fallbackContent = {
    title: fallback.title,
    description: fallback.description,
    features: [...fallback.features],
    showcase: { ...fallback.showcase },
  };

  if (!content || typeof content !== "object") {
    return fallbackContent;
  }

  const source = content as Partial<AboutSectionContent>;

  return {
    title: typeof source.title === "string" ? source.title : fallback.title,
    description:
      typeof source.description === "string"
        ? source.description
        : fallback.description,
    features: Array.isArray(source.features)
      ? source.features
          .filter((feature) => feature && typeof feature === "object")
          .map((feature) => {
            const item = feature as {
              icon?: unknown;
              title?: unknown;
              description?: unknown;
            };

            return {
              icon: typeof item.icon === "string" ? item.icon : "Shield",
              title: typeof item.title === "string" ? item.title : "",
              description:
                typeof item.description === "string" ? item.description : "",
            };
          })
          .filter((feature) => feature.title && feature.description)
      : fallbackContent.features,
    showcase: {
      image:
        typeof source.showcase?.image === "string"
          ? source.showcase.image
          : fallback.showcase.image,
      title:
        typeof source.showcase?.title === "string"
          ? source.showcase.title
          : fallback.showcase.title,
      description:
        typeof source.showcase?.description === "string"
          ? source.showcase.description
          : fallback.showcase.description,
    },
  };
}

export async function About() {
  const { content } = await getSiteSection("about");
  const about = asAboutContent(content);

  return (
    <section
      id="about"
      className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 bg-white dark:bg-gray-950"
    >
      <div className="mx-auto max-w-7xl">
        <AboutHeader title={about.title} description={about.description} />
        <FeaturesGrid features={about.features} />
        <AboutShowcase
          image={about.showcase.image}
          title={about.showcase.title}
          description={about.showcase.description}
        />
      </div>
    </section>
  );
}
