import { HeroClient } from "@/features/home/hero/components/hero-client";
import { defaultSiteContent } from "@/lib/default-site-content";
import { getSiteSection } from "@/lib/site-content/queries";

export interface HeroSectionContent {
  heading: string;
  emphasizedHeading: string;
  tagline: string;
  backgroundImage: {
    url: string;
    alt: string;
  };
  footerFeatures: Array<{
    icon: string;
    text: string;
  }>;
}

function asHeroContent(content: unknown): HeroSectionContent {
  const fallback = defaultSiteContent.hero;
  const fallbackContent = {
    heading: fallback.heading,
    emphasizedHeading: fallback.emphasizedHeading,
    tagline: fallback.tagline,
    backgroundImage: { ...fallback.backgroundImage },
    footerFeatures: [...fallback.footerFeatures],
  };

  if (!content || typeof content !== "object") {
    return fallbackContent;
  }

  const source = content as Partial<HeroSectionContent>;

  return {
    heading:
      typeof source.heading === "string" ? source.heading : fallbackContent.heading,
    emphasizedHeading:
      typeof source.emphasizedHeading === "string"
        ? source.emphasizedHeading
        : fallbackContent.emphasizedHeading,
    tagline:
      typeof source.tagline === "string" ? source.tagline : fallbackContent.tagline,
    backgroundImage: {
      url:
        typeof source.backgroundImage?.url === "string"
          ? source.backgroundImage.url
          : fallbackContent.backgroundImage.url,
      alt:
        typeof source.backgroundImage?.alt === "string"
          ? source.backgroundImage.alt
          : fallbackContent.backgroundImage.alt,
    },
    footerFeatures: Array.isArray(source.footerFeatures)
      ? source.footerFeatures
          .filter((feature) => feature && typeof feature === "object")
          .map((feature) => {
            const item = feature as { icon?: unknown; text?: unknown };

            return {
              icon: typeof item.icon === "string" ? item.icon : "Shield",
              text: typeof item.text === "string" ? item.text : "",
            };
          })
          .filter((feature) => feature.text)
      : fallbackContent.footerFeatures,
  };
}

export async function Hero() {
  const { content } = await getSiteSection("hero");

  return <HeroClient content={asHeroContent(content)} />;
}
