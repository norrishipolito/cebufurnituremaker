import { redirect } from "next/navigation";
import type { ComponentType, ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FolderKanban,
  Image,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  MessageSquareQuote,
  Moon,
  Save,
  Settings,
  ShieldCheck,
  Type,
  Upload,
  Users,
} from "lucide-react";
import { AdminPageShell } from "../_components/admin-page-shell";
import { getCurrentAdminProfile } from "@/lib/auth/require-admin";
import { canManageSettings, canManageUsers } from "@/lib/auth/roles";

interface FieldDoc {
  label: string;
  sample: string;
  note?: string;
}

interface PageDoc {
  id: string;
  title: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
  permission: string;
  purpose: string;
  workflow: string[];
  fields: FieldDoc[];
  tips: string[];
  adminOnly?: boolean;
}

const quickStartSteps = [
  { text: "Use Dashboard to choose the admin area you need." },
  {
    text: "Use Content for homepage copy, contact details, footer links, and social URLs.",
  },
  {
    text: "Use Projects for portfolio cards, uploaded project images, visibility, and drag ordering.",
  },
  {
    text: "Use Testimonials for customer quotes, visibility, and drag ordering.",
  },
  { text: "Use Media for existing asset alt text and unused asset deletion." },
  {
    text: "Admins use Users for account creation, role assignment, password changes, and deletion.",
    adminOnly: true,
  },
];

const pageDocs: PageDoc[] = [
  {
    id: "login",
    title: "Login",
    path: "/admin/login",
    icon: LockKeyhole,
    permission: "Public page. Requires valid Supabase credentials to continue.",
    purpose:
      "Signs editors into the admin UI. The admin sidebar and header are hidden until authentication succeeds.",
    workflow: [
      "Open `/admin/login`.",
      "Enter an email assigned to an admin or maintainer profile.",
      "Enter the password.",
      "Click Sign in.",
      "Successful sign-in redirects to `/admin`.",
    ],
    fields: [
      {
        label: "Email",
        sample: "editor@cebufurnituremaker.com",
        note: "The email must exist in Supabase Auth and have a matching `profiles` row.",
      },
      {
        label: "Password",
        sample: "Password1.",
        note: "Use the temporary password from the admin who created the user.",
      },
    ],
    tips: [
      "If sign-in loops back to login, check that the user has an `admin` or `maintainer` role.",
      "The login page should never show the admin sidebar.",
    ],
  },
  {
    id: "dashboard",
    title: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    permission: "Admin and maintainer.",
    purpose:
      "Acts as the starting point for admin work and links to the main editable areas.",
    workflow: [
      "Open `/admin` after signing in.",
      "Choose Content, Projects, Media, or Users if your role can access it.",
      "Use View Site in the header to check public output.",
      "Use Sign out when finished.",
    ],
    fields: [
      {
        label: "Dashboard card",
        sample: "Projects",
        note: "Cards open the related admin page.",
      },
    ],
    tips: [
      "Maintainers do not see admin-only Users or Settings entry points.",
      "Use the dark-mode toggle in the header when editing in low light.",
    ],
  },
  {
    id: "content",
    title: "Content",
    path: "/admin/content",
    icon: Type,
    permission: "Admin and maintainer.",
    purpose:
      "Edits homepage section text and footer details through guided forms. Sections are collapsed by default.",
    workflow: [
      "Open `/admin/content`.",
      "Expand Hero, About, Contact, or Footer.",
      "Update only the fields you want to change.",
      "Click that section's Save button.",
      "Open the public site and confirm the saved content appears.",
    ],
    fields: [
      {
        label: "Hero heading",
        sample: "Custom narra furniture for homes that breathe",
      },
      {
        label: "Hero tagline",
        sample: "Designed in Cebu, crafted for everyday living.",
      },
      {
        label: "Showcase title",
        sample: "Our Cebu Workshop",
      },
      {
        label: "Showcase image URL",
        sample: "https://images.example.com/workshop.jpg",
      },
      {
        label: "Showcase description",
        sample: "A short story about the workshop, materials, and process.",
      },
      {
        label: "Contact email",
        sample: "hello@cebufurnituremaker.com",
      },
      {
        label: "Facebook URL",
        sample: "https://facebook.com/cebufurnituremaker",
      },
      {
        label: "Instagram URL",
        sample: "https://instagram.com/cebufurnituremaker",
      },
      {
        label: "Twitter URL",
        sample: "https://twitter.com/cebufurnituremaker",
      },
    ],
    tips: [
      "Save actions are per section. Saving Footer does not save Hero.",
      "Footer social links support Facebook, Instagram, and Twitter only.",
      "Navigation links are fixed site structure and are not editable here.",
    ],
  },
  {
    id: "projects",
    title: "Projects",
    path: "/admin/projects",
    icon: FolderKanban,
    permission: "Admin and maintainer.",
    purpose:
      "Creates and manages public project cards, including uploaded images, visibility, groups, and drag ordering.",
    workflow: [
      "Open `/admin/projects`.",
      "Fill the project form.",
      "Upload the project image and add alt text.",
      "Keep Show in Projects section checked if it should appear publicly.",
      "Click Create Project.",
      "Drag saved project handles to reorder the public list.",
    ],
    fields: [
      {
        label: "Title",
        sample: "Narra Dining Table",
      },
      {
        label: "Slug",
        sample: "narra-dining-table",
        note: "Use lowercase letters, numbers, and hyphens.",
      },
      {
        label: "Category",
        sample: "Dining Room",
      },
      {
        label: "Group",
        sample: "custom_builds",
        note: "Groups become public tabs. New groups are allowed.",
      },
      {
        label: "Description",
        sample: "Solid wood table with hand-finished edges and seating for six.",
      },
      {
        label: "Image alt text",
        sample: "Narra dining table in a Cebu showroom",
      },
    ],
    tips: [
      "Do not use numeric sort inputs. Reorder by dragging.",
      "Deleting removes the project. Unchecking visibility only hides it.",
      "Image upload happens here, not on the Media page.",
    ],
  },
  {
    id: "testimonials",
    title: "Testimonials",
    path: "/admin/testimonials",
    icon: MessageSquareQuote,
    permission: "Admin and maintainer.",
    purpose:
      "Creates and manages customer quotes shown in the public testimonials section.",
    workflow: [
      "Open `/admin/testimonials`.",
      "Fill name, role, quote, and visibility.",
      "Click Create Testimonial.",
      "Edit saved rows directly when needed.",
      "Drag testimonial handles to change display order.",
    ],
    fields: [
      {
        label: "Name",
        sample: "Maria Santos",
      },
      {
        label: "Role",
        sample: "Interior Designer",
      },
      {
        label: "Quote",
        sample:
          "The craftsmanship exceeded our expectations and the team made the process easy.",
      },
      {
        label: "Show in Testimonials section",
        sample: "Checked",
        note: "Uncheck to hide without deleting.",
      },
    ],
    tips: [
      "Use real customer wording when available.",
      "Keep quotes concise enough to scan.",
      "Delete only when the record should be fully removed.",
    ],
  },
  {
    id: "media",
    title: "Media",
    path: "/admin/media",
    icon: Image,
    permission: "Admin and maintainer.",
    purpose:
      "Reviews uploaded image assets and manages alt text. Uploading is intentionally handled from Projects.",
    workflow: [
      "Open `/admin/media`.",
      "Find the uploaded asset.",
      "Update the alt text if needed.",
      "Click Save.",
      "Delete only assets that are not attached to content.",
    ],
    fields: [
      {
        label: "Alt text",
        sample: "Close-up of a handcrafted cabinet handle",
      },
    ],
    tips: [
      "The Media page has no upload field.",
      "If delete is blocked, detach the image from projects or testimonials first.",
      "Alt text should describe what is visible in the image.",
    ],
  },
  {
    id: "users",
    title: "Users",
    path: "/admin/users",
    icon: Users,
    permission: "Admin only.",
    purpose:
      "Creates and manages admin users, maintainer users, passwords, and roles.",
    workflow: [
      "Open `/admin/users` as an admin.",
      "Create a user with email, display name, temporary password, and role.",
      "Update role or profile details from the saved user row.",
      "Set a new password only when needed.",
      "Delete users who should no longer access the admin UI.",
    ],
    fields: [
      {
        label: "Display name",
        sample: "Admin Assistant",
      },
      {
        label: "Email",
        sample: "maintainer@cebufurnituremaker.com",
      },
      {
        label: "Temporary password",
        sample: "Password1.",
      },
      {
        label: "Role",
        sample: "maintainer",
        note: "Use admin only for people who need user and settings access.",
      },
    ],
    tips: [
      "The current admin cannot delete their own account.",
      "The current admin cannot change their own role.",
      "The system must keep at least one admin.",
    ],
    adminOnly: true,
  },
  {
    id: "settings",
    title: "Settings",
    path: "/admin/settings",
    icon: Settings,
    permission: "Admin only.",
    purpose:
      "Reserved for site-level settings. This is intentionally limited until a specific settings feature is implemented.",
    workflow: [
      "Open `/admin/settings` as an admin.",
      "Review available site-level settings.",
      "Use feature documentation before adding new settings controls.",
    ],
    fields: [
      {
        label: "Future setting example",
        sample: "NEXT_PUBLIC_SITE_URL",
      },
    ],
    tips: [
      "Maintainers cannot see or open Settings.",
      "Do not add broad settings without documenting the workflow and tests.",
    ],
    adminOnly: true,
  },
  {
    id: "documentation",
    title: "Documentation",
    path: "/admin/documentation",
    icon: BookOpen,
    permission: "Admin and maintainer.",
    purpose:
      "Provides this admin manual, workflow notes, page-specific sample inputs, and visual references.",
    workflow: [
      "Open the Documentation link at the bottom of the sidebar.",
      "Use the table of contents to jump to a page.",
      "Copy sample input formats when creating new content.",
      "Check Good Habits before changing public-facing content.",
    ],
    fields: [
      {
        label: "Table of contents link",
        sample: "Projects",
      },
    ],
    tips: [
      "Documentation should be updated when admin workflows change.",
      "This page is authenticated, so public visitors cannot read admin workflow details.",
    ],
  },
];

function ScreenshotPreview({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex h-9 items-center gap-2 border-b bg-gray-50 px-3 dark:border-gray-800 dark:bg-gray-950">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function SampleField({ field }: { field: FieldDoc }) {
  return (
    <div className="rounded-md border bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {field.label}
      </p>
      <p className="mt-1 break-words text-sm font-medium">{field.sample}</p>
      {field.note ? (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {field.note}
        </p>
      ) : null}
    </div>
  );
}

function PageManualSection({ page }: { page: PageDoc }) {
  return (
    <section
      id={page.id}
      className="scroll-mt-20 rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <page.icon className="mt-0.5 h-5 w-5 text-gray-500" />
          <div>
            <h2 className="text-xl font-semibold">{page.title}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {page.path}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          {page.permission}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-700 dark:text-gray-300">
        {page.purpose}
      </p>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div>
          <h3 className="text-sm font-semibold">Workflow</h3>
          <ol className="mt-3 space-y-2">
            {page.workflow.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white dark:bg-gray-100 dark:text-gray-900">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Notes</h3>
          <ul className="mt-3 space-y-2">
            {page.tips.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold">Sample Inputs</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {page.fields.map((field) => (
            <SampleField key={`${page.id}-${field.label}`} field={field} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function AdminDocumentationPage() {
  const auth = await getCurrentAdminProfile();

  if (!auth) {
    redirect("/admin/login");
  }

  const canViewAdminOnlyDocs =
    canManageUsers(auth.profile.role) && canManageSettings(auth.profile.role);
  const visibleQuickStartSteps = quickStartSteps.filter(
    (step) => !step.adminOnly || canViewAdminOnlyDocs
  );
  const visiblePageDocs = pageDocs.filter(
    (page) => !page.adminOnly || canViewAdminOnlyDocs
  );

  return (
    <AdminPageShell
      title="Admin Documentation"
      description="A page-by-page manual for editing the Cebu Furniture Maker website from the admin UI."
    >
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <nav className="rounded-lg border bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
            <p className="px-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              Contents
            </p>
            <div className="mt-2 space-y-1">
              <a
                href="#quick-start"
                className="block rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Quick Start
              </a>
              <a
                href="#visual-guide"
                className="block rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Visual Guide
              </a>
              {visiblePageDocs.map((page) => (
                <a
                  key={page.id}
                  href={`#${page.id}`}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <page.icon className="h-4 w-4" />
                  {page.title}
                </a>
              ))}
              <a
                href="#good-habits"
                className="block rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Good Habits
              </a>
            </div>
          </nav>
        </aside>

        <div className="space-y-6">
          <section
            id="quick-start"
            className="scroll-mt-20 rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 h-5 w-5 text-gray-500" />
              <div>
                <h2 className="text-lg font-semibold">Quick Start</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Follow this flow for the usual editing session.
                </p>
              </div>
            </div>
            <ol className="mt-4 grid gap-2 md:grid-cols-2">
              {visibleQuickStartSteps.map((step, index) => (
                <li
                  key={step.text}
                  className="flex gap-3 rounded-md border bg-gray-50 p-3 text-sm dark:border-gray-800 dark:bg-gray-950"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white dark:bg-gray-100 dark:text-gray-900">
                    {index + 1}
                  </span>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
          </section>

          <section id="visual-guide" className="scroll-mt-20">
            <div className="mb-3">
              <h2 className="text-lg font-semibold">Visual Guide</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Screenshot-style previews of common admin screens.
              </p>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <ScreenshotPreview title="/admin/content">
                <div className="space-y-3">
                  {["Hero", "About", "Contact", "Footer"].map((section) => (
                    <div
                      key={section}
                      className="flex items-center justify-between rounded-md border p-3 dark:border-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <ChevronDown className="-rotate-90 h-4 w-4 text-gray-500" />
                        <span className="text-sm font-semibold">{section}</span>
                      </div>
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        collapsed
                      </span>
                    </div>
                  ))}
                  <div className="rounded-md border p-3 dark:border-gray-800">
                    <div className="mb-2 flex items-center gap-2">
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-semibold">Footer</span>
                    </div>
                    <div className="grid gap-2 text-xs md:grid-cols-3">
                      <span className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-800">
                        Facebook URL
                      </span>
                      <span className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-800">
                        Instagram URL
                      </span>
                      <span className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-800">
                        Twitter URL
                      </span>
                    </div>
                  </div>
                </div>
              </ScreenshotPreview>

              <ScreenshotPreview title="/admin/projects">
                <div className="space-y-3">
                  <div className="grid gap-2 md:grid-cols-2">
                    <span className="rounded-md border px-3 py-2 text-sm dark:border-gray-800">
                      Title
                    </span>
                    <span className="rounded-md border px-3 py-2 text-sm dark:border-gray-800">
                      Slug
                    </span>
                    <span className="rounded-md border px-3 py-2 text-sm dark:border-gray-800">
                      Category
                    </span>
                    <span className="rounded-md border px-3 py-2 text-sm dark:border-gray-800">
                      Group
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border p-3 dark:border-gray-800">
                    <Upload className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Project image upload + alt text</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border p-3 dark:border-gray-800">
                    <ListChecks className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Drag handles reorder saved projects
                    </span>
                  </div>
                </div>
              </ScreenshotPreview>
            </div>
          </section>

          {visiblePageDocs.map((page) => (
            <PageManualSection key={page.id} page={page} />
          ))}

          <section
            id="good-habits"
            className="scroll-mt-20 rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <h2 className="text-lg font-semibold">Good Habits</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-md border p-3 dark:border-gray-800">
                <Save className="h-4 w-4 text-gray-500" />
                <h3 className="mt-2 text-sm font-semibold">Save per section</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Content saves are scoped. Save Hero, About, Contact, or Footer
                  separately.
                </p>
              </div>
              <div className="rounded-md border p-3 dark:border-gray-800">
                <ShieldCheck className="h-4 w-4 text-gray-500" />
                <h3 className="mt-2 text-sm font-semibold">Use clear alt text</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Describe the actual image so public pages stay accessible.
                </p>
              </div>
              <div className="rounded-md border p-3 dark:border-gray-800">
                <Moon className="h-4 w-4 text-gray-500" />
                <h3 className="mt-2 text-sm font-semibold">Dark mode is local</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  The admin theme toggle changes only your browser preference.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminPageShell>
  );
}
