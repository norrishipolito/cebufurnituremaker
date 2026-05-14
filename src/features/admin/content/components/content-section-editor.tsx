"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { defaultSiteContent } from "@/lib/default-site-content";
import type { SiteSectionKey } from "@/lib/default-site-content";

interface HeroContent {
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

interface AboutContent {
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

interface ContactContent {
  title: string;
  description: string;
  email: string;
  emailDescription: string;
  projectInquiryLabel: string;
  projectInquiryValue: string;
  projectInquiryDescription: string;
  phone: string;
  phoneDescription: string;
  address: string;
  addressDescription: string;
  hoursTitle: string;
  hours: string;
}

interface FooterContent {
  brand: string;
  socialLinks: Array<{
    label: string;
    href: string;
  }>;
  columns: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
}

interface ContentSectionEditorProps {
  initialContent: Record<SiteSectionKey, unknown>;
  sources: Record<SiteSectionKey, string>;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeObject<T>(value: unknown, fallback: T): T {
  if (!value || typeof value !== "object") {
    return clone(fallback);
  }

  return { ...clone(fallback), ...(value as Partial<T>) };
}

function updateSocialLink(
  links: FooterContent["socialLinks"],
  label: string,
  href: string
) {
  const hasExistingLink = links.some(
    (link) => link.label.toLowerCase() === label.toLowerCase()
  );

  if (!hasExistingLink) {
    return [...links, { label, href }];
  }

  return links.map((link) =>
    link.label.toLowerCase() === label.toLowerCase()
      ? { ...link, href }
      : link
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("grid gap-1.5 text-sm font-medium", className)}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
    />
  );
}

function SectionCard({
  title,
  source,
  status,
  onSubmit,
  children,
}: {
  title: string;
  source: string;
  status?: string | null;
  onSubmit: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = `content-section-${title.toLowerCase()}`;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-4 p-4">
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={() => setIsExpanded((current) => !current)}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              !isExpanded && "-rotate-90"
            )}
          />
          <h2 className="truncate text-lg font-semibold">{title}</h2>
        </button>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {source}
        </span>
      </div>
      {isExpanded ? (
        <form id={contentId} onSubmit={submit} className="space-y-4 px-4 pb-4">
          {children}
          <div className="flex items-center gap-3 border-t pt-4 dark:border-gray-800">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : `Save ${title.toLowerCase()}`}
            </Button>
            {status ? (
              <p
                data-testid={`content-editor-${title.toLowerCase()}-status`}
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {status}
              </p>
            ) : null}
          </div>
        </form>
      ) : null}
    </section>
  );
}

export function ContentSectionEditor({
  initialContent,
  sources,
}: ContentSectionEditorProps) {
  const [hero, setHero] = useState<HeroContent>(() =>
    normalizeObject(initialContent.hero, defaultSiteContent.hero) as unknown as HeroContent
  );
  const [about, setAbout] = useState<AboutContent>(() =>
    normalizeObject(initialContent.about, defaultSiteContent.about) as unknown as AboutContent
  );
  const [contact, setContact] = useState<ContactContent>(() =>
    normalizeObject(initialContent.contact, defaultSiteContent.contact) as unknown as ContactContent
  );
  const [footer, setFooter] = useState<FooterContent>(() =>
    normalizeObject(initialContent.footer, defaultSiteContent.footer) as unknown as FooterContent
  );
  const [statuses, setStatuses] = useState<Record<string, string | null>>({});

  async function saveSection(sectionKey: SiteSectionKey, content: unknown) {
    setStatuses((current) => ({ ...current, [sectionKey]: "Saving..." }));
    const response = await fetch(`/api/admin/content/${sectionKey}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      const payload = await response.json();
      setStatuses((current) => ({
        ...current,
        [sectionKey]: payload.error ?? "Unable to save",
      }));
      return;
    }

    setStatuses((current) => ({ ...current, [sectionKey]: "Saved" }));
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Hero"
        source={sources.hero}
        status={statuses.hero}
        onSubmit={() => saveSection("hero", hero)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Hero heading">
            <Input
              value={hero.heading}
              placeholder="Hero heading (ex. Design furniture for spaces that breathe.)"
              onChange={(event) =>
                setHero((current) => ({ ...current, heading: event.target.value }))
              }
            />
          </Field>
          <Field label="Emphasized heading text">
            <Input
              value={hero.emphasizedHeading}
              placeholder="Emphasis text (ex. spaces that breathe.)"
              onChange={(event) =>
                setHero((current) => ({
                  ...current,
                  emphasizedHeading: event.target.value,
                }))
              }
            />
          </Field>
        </div>
        <Field label="Hero tagline">
          <Textarea
            value={hero.tagline}
            placeholder="Hero tagline (ex. Designed in Cebu, crafted to endure.)"
            onChange={(value) =>
              setHero((current) => ({ ...current, tagline: value }))
            }
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Hero background image URL">
            <Input
              value={hero.backgroundImage.url}
              placeholder="Image URL (ex. https://.../hero.jpg)"
              onChange={(event) =>
                setHero((current) => ({
                  ...current,
                  backgroundImage: {
                    ...current.backgroundImage,
                    url: event.target.value,
                  },
                }))
              }
            />
          </Field>
          <Field label="Hero background alt text">
            <Input
              value={hero.backgroundImage.alt}
              placeholder="Alt text (ex. Modern interior with handmade sofa)"
              onChange={(event) =>
                setHero((current) => ({
                  ...current,
                  backgroundImage: {
                    ...current.backgroundImage,
                    alt: event.target.value,
                  },
                }))
              }
            />
          </Field>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Hero footer features</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setHero((current) => ({
                  ...current,
                  footerFeatures: [
                    ...current.footerFeatures,
                    { icon: "Shield", text: "New feature" },
                  ],
                }))
              }
            >
              Add feature
            </Button>
          </div>
          {hero.footerFeatures.map((feature, index) => (
            <div key={index} className="grid gap-3 rounded-md border p-3 md:grid-cols-[160px_1fr_auto]">
              <Field label="Icon">
                <select
                  value={feature.icon}
                  onChange={(event) =>
                    setHero((current) => ({
                      ...current,
                      footerFeatures: current.footerFeatures.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, icon: event.target.value }
                          : item
                      ),
                    }))
                  }
                  className="h-9 rounded-md border bg-transparent px-3 text-sm"
                >
                  <option value="Truck">Truck</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Shield">Shield</option>
                </select>
              </Field>
              <Field label="Text">
                <Input
                  value={feature.text}
                  placeholder="Feature text (ex. Free design consultation)"
                  onChange={(event) =>
                    setHero((current) => ({
                      ...current,
                      footerFeatures: current.footerFeatures.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, text: event.target.value }
                          : item
                      ),
                    }))
                  }
                />
              </Field>
              <Button
                type="button"
                variant="outline"
                className="self-end"
                onClick={() =>
                  setHero((current) => ({
                    ...current,
                    footerFeatures: current.footerFeatures.filter(
                      (_item, itemIndex) => itemIndex !== index
                    ),
                  }))
                }
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="About"
        source={sources.about}
        status={statuses.about}
        onSubmit={() => saveSection("about", about)}
      >
        <Field label="About title">
          <Input
            value={about.title}
            placeholder="About title (ex. Crafted with care in Cebu)"
            onChange={(event) =>
              setAbout((current) => ({ ...current, title: event.target.value }))
            }
          />
        </Field>
        <Field label="About description">
          <Textarea
            value={about.description}
            placeholder="About description (ex. Tell visitors what makes your workshop different.)"
            onChange={(value) =>
              setAbout((current) => ({ ...current, description: value }))
            }
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Showcase title">
            <Input
              value={about.showcase.title}
              placeholder="Showcase title (ex. Our Story)"
              onChange={(event) =>
                setAbout((current) => ({
                  ...current,
                  showcase: { ...current.showcase, title: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Showcase image URL">
            <Input
              value={about.showcase.image}
              placeholder="Image URL (ex. https://.../workshop.jpg)"
              onChange={(event) =>
                setAbout((current) => ({
                  ...current,
                  showcase: { ...current.showcase, image: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Showcase description" className="md:col-span-2">
            <Textarea
              value={about.showcase.description}
              placeholder="Showcase description (ex. A short paragraph about the workshop.)"
              onChange={(value) =>
                setAbout((current) => ({
                  ...current,
                  showcase: { ...current.showcase, description: value },
                }))
              }
              rows={2}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Contact"
        source={sources.contact}
        status={statuses.contact}
        onSubmit={() => saveSection("contact", contact)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Contact title">
            <Input
              value={contact.title}
              placeholder="Contact title (ex. Get in touch)"
              onChange={(event) =>
                setContact((current) => ({ ...current, title: event.target.value }))
              }
            />
          </Field>
          <Field label="Contact description" className="md:col-span-2">
            <Textarea
              value={contact.description}
              placeholder="Contact description (ex. Share your project details and we will help with the next step.)"
              onChange={(value) =>
                setContact((current) => ({ ...current, description: value }))
              }
            />
          </Field>
          <Field label="Contact email">
            <Input
              type="email"
              value={contact.email}
              placeholder="Email (ex. hello@example.com)"
              onChange={(event) =>
                setContact((current) => ({ ...current, email: event.target.value }))
              }
            />
          </Field>
          <Field label="Email card description">
            <Input
              value={contact.emailDescription}
              placeholder="Email card description (ex. Send project notes, dimensions, or inspiration photos.)"
              onChange={(event) =>
                setContact((current) => ({
                  ...current,
                  emailDescription: event.target.value,
                }))
              }
            />
          </Field>
          <Field label="Project inquiry card title">
            <Input
              value={contact.projectInquiryLabel}
              placeholder="Project inquiry card title (ex. Project inquiries)"
              onChange={(event) =>
                setContact((current) => ({
                  ...current,
                  projectInquiryLabel: event.target.value,
                }))
              }
            />
          </Field>
          <Field label="Project inquiry card value">
            <Input
              value={contact.projectInquiryValue}
              placeholder="Project inquiry card value (ex. Custom furniture, repairs, and consultations)"
              onChange={(event) =>
                setContact((current) => ({
                  ...current,
                  projectInquiryValue: event.target.value,
                }))
              }
            />
          </Field>
          <Field label="Project inquiry card description" className="md:col-span-2">
            <Textarea
              value={contact.projectInquiryDescription}
              placeholder="Project inquiry card description (ex. Tell us what you are planning and we will guide the next step.)"
              onChange={(value) =>
                setContact((current) => ({
                  ...current,
                  projectInquiryDescription: value,
                }))
              }
              rows={2}
            />
          </Field>
          <Field label="Contact phone">
            <Input
              value={contact.phone}
              placeholder="Phone (ex. +63 32 123 4567)"
              onChange={(event) =>
                setContact((current) => ({ ...current, phone: event.target.value }))
              }
            />
          </Field>
          <Field label="Phone card description">
            <Input
              value={contact.phoneDescription}
              placeholder="Phone card description (ex. Call us for quick timeline questions.)"
              onChange={(event) =>
                setContact((current) => ({
                  ...current,
                  phoneDescription: event.target.value,
                }))
              }
            />
          </Field>
          <Field label="Contact address">
            <Input
              value={contact.address}
              placeholder="Address (ex. Cebu City, Philippines)"
              onChange={(event) =>
                setContact((current) => ({
                  ...current,
                  address: event.target.value,
                }))
              }
            />
          </Field>
          <Field label="Address card description">
            <Input
              value={contact.addressDescription}
              placeholder="Address card description (ex. Visit or coordinate a workshop consultation in Cebu.)"
              onChange={(event) =>
                setContact((current) => ({
                  ...current,
                  addressDescription: event.target.value,
                }))
              }
            />
          </Field>
          <Field label="Hours card title">
            <Input
              value={contact.hoursTitle}
              placeholder="Hours card title (ex. Workshop hours)"
              onChange={(event) =>
                setContact((current) => ({
                  ...current,
                  hoursTitle: event.target.value,
                }))
              }
            />
          </Field>
          <Field label="Workshop hours">
            <Input
              value={contact.hours}
              placeholder="Workshop hours (ex. Monday to Saturday, 9:00 AM to 6:00 PM)"
              onChange={(event) =>
                setContact((current) => ({
                  ...current,
                  hours: event.target.value,
                }))
              }
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Footer"
        source={sources.footer}
        status={statuses.footer}
        onSubmit={() => saveSection("footer", footer)}
      >
        <Field label="Footer brand description">
          <Textarea
            value={footer.brand}
            placeholder="Footer brand description (ex. Handcrafted furniture designed and built in Cebu.)"
            onChange={(value) =>
              setFooter((current) => ({ ...current, brand: value }))
            }
          />
        </Field>
        <div className="space-y-3 rounded-md border p-3 dark:border-gray-800">
          <h3 className="text-sm font-semibold">Footer social links</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {["Facebook", "Instagram", "Twitter"].map((label) => {
              const link =
                footer.socialLinks.find(
                  (item) => item.label.toLowerCase() === label.toLowerCase()
                ) ?? { label, href: "" };

              return (
                <Field key={label} label={`${label} URL`}>
                  <Input
                    value={link.href}
                    placeholder={`${label} URL (ex. https://${label.toLowerCase()}.com/cebufurnituremaker)`}
                    onChange={(event) =>
                      setFooter((current) => ({
                        ...current,
                        socialLinks: updateSocialLink(
                          current.socialLinks,
                          label,
                          event.target.value
                        ),
                      }))
                    }
                  />
                </Field>
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">Footer columns</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setFooter((current) => ({
                  ...current,
                  columns: [...current.columns, { title: "", links: [] }],
                }))
              }
            >
              Add column
            </Button>
          </div>
          {footer.columns.map((column, columnIndex) => (
            <div key={columnIndex} className="space-y-3 rounded-md border p-3">
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <Field label="Column title">
                  <Input
                    value={column.title}
                    placeholder="Column title (ex. Company)"
                    onChange={(event) =>
                      setFooter((current) => ({
                        ...current,
                        columns: current.columns.map((item, itemIndex) =>
                          itemIndex === columnIndex
                            ? { ...item, title: event.target.value }
                            : item
                        ),
                      }))
                    }
                  />
                </Field>
                <Button
                  type="button"
                  variant="outline"
                  className="self-end"
                  onClick={() =>
                    setFooter((current) => ({
                      ...current,
                      columns: current.columns.filter(
                        (_item, itemIndex) => itemIndex !== columnIndex
                      ),
                    }))
                  }
                >
                  Remove column
                </Button>
              </div>
              {column.links.map((link, linkIndex) => (
                <div key={linkIndex} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <Field label="Link label">
                    <Input
                      value={link.label}
                      placeholder="Link label (ex. About Us)"
                      onChange={(event) =>
                        setFooter((current) => ({
                          ...current,
                          columns: current.columns.map((item, itemIndex) =>
                            itemIndex === columnIndex
                              ? {
                                  ...item,
                                  links: item.links.map((footerLink, footerLinkIndex) =>
                                    footerLinkIndex === linkIndex
                                      ? {
                                          ...footerLink,
                                          label: event.target.value,
                                        }
                                      : footerLink
                                  ),
                                }
                              : item
                          ),
                        }))
                      }
                    />
                  </Field>
                  <Field label="Link URL">
                    <Input
                      value={link.href}
                      placeholder="Link URL (ex. /about)"
                      onChange={(event) =>
                        setFooter((current) => ({
                          ...current,
                          columns: current.columns.map((item, itemIndex) =>
                            itemIndex === columnIndex
                              ? {
                                  ...item,
                                  links: item.links.map((footerLink, footerLinkIndex) =>
                                    footerLinkIndex === linkIndex
                                      ? {
                                          ...footerLink,
                                          href: event.target.value,
                                        }
                                      : footerLink
                                  ),
                                }
                              : item
                          ),
                        }))
                      }
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="outline"
                    className="self-end"
                    onClick={() =>
                      setFooter((current) => ({
                        ...current,
                        columns: current.columns.map((item, itemIndex) =>
                          itemIndex === columnIndex
                            ? {
                                ...item,
                                links: item.links.filter(
                                  (_footerLink, footerLinkIndex) =>
                                    footerLinkIndex !== linkIndex
                                ),
                              }
                            : item
                        ),
                      }))
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFooter((current) => ({
                    ...current,
                    columns: current.columns.map((item, itemIndex) =>
                      itemIndex === columnIndex
                        ? {
                            ...item,
                            links: [...item.links, { label: "", href: "" }],
                          }
                        : item
                    ),
                  }))
                }
              >
                Add link
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
