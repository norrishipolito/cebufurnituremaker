import { AdminPageShell } from "../../_components/admin-page-shell";
import { defaultSiteContent, type SiteSectionKey } from "@/lib/default-site-content";
import { getSiteSection } from "@/lib/site-content/queries";
import { ContentSectionEditor } from "@/features/admin/content/components/content-section-editor";

const sections: SiteSectionKey[] = ["hero", "about", "contact", "footer"];

export default async function AdminContentPage() {
  const sectionData = await Promise.all(
    sections.map(async (sectionKey) => ({
      sectionKey,
      ...(await getSiteSection(sectionKey)),
    }))
  );
  const initialContent = Object.fromEntries(
    sectionData.map((section) => [
      section.sectionKey,
      section.content ?? defaultSiteContent[section.sectionKey],
    ])
  ) as Record<SiteSectionKey, unknown>;
  const sources = Object.fromEntries(
    sectionData.map((section) => [section.sectionKey, section.source])
  ) as Record<SiteSectionKey, string>;

  return (
    <AdminPageShell
      title="Content"
      description="Edit homepage text, links, and section content using guided fields. Empty database sections are prefilled from local defaults."
    >
      <ContentSectionEditor initialContent={initialContent} sources={sources} />
    </AdminPageShell>
  );
}
