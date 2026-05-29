import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Images, Sofa } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/common/layouts/footer";
import { ProjectCta } from "@/components/shadcn-space/blocks/cta-01/cta";
import { ProjectImageCarousel } from "@/features/home/projects/components/project-image-carousel";
import { getPublicProjectBySlug } from "@/lib/site-content/queries";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

interface PublicProjectDetail {
  slug: string;
  image?: string;
  images?: {
    url: string;
    alt: string;
  }[];
  title: string;
  description: string;
  category: string;
  primary_asset?: {
    blob_url?: string | null;
    blob_pathname?: string | null;
    alt_text?: string | null;
  } | null;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const result = await getPublicProjectBySlug(slug);

  if (!result) {
    notFound();
  }

  const project = result.project as PublicProjectDetail;
  const primaryImage = project.primary_asset?.blob_pathname
    ? `/api/blob/${project.primary_asset.blob_pathname}`
    : project.primary_asset?.blob_url ?? project.image ?? "";
  const images =
    project.images?.length
      ? project.images
      : primaryImage
        ? [{ url: primaryImage, alt: project.primary_asset?.alt_text ?? project.title }]
        : [];

  return (
    <>
      <main className="min-h-screen bg-white text-gray-950 dark:bg-gray-950 dark:text-white">
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Button asChild variant="ghost" className="mb-6">
              <Link href="/#projects">
                <ArrowLeft />
                Projects
              </Link>
            </Button>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
              <ProjectImageCarousel
                images={images}
                title={project.title}
                priority
                className="overflow-hidden rounded-lg"
                imageClassName="lg:min-h-[620px]"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />

              <div className="lg:pt-8">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-300/15 dark:text-amber-200">
                    <Sofa className="size-3.5" />
                    {project.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    <Images className="size-3.5" />
                    {images.length || 1} images
                  </span>
                </div>
                <h1 className="mt-3 text-4xl font-semibold text-gray-950 dark:text-white">
                  {project.title}
                </h1>
                <p className="mt-5 text-base leading-7 text-gray-600 dark:text-gray-300">
                  {project.description}
                </p>
                <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
                    <dt className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                      Category
                    </dt>
                    <dd className="mt-1 text-sm font-medium">{project.category}</dd>
                  </div>
                  <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
                    <dt className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                      Gallery
                    </dt>
                    <dd className="mt-1 text-sm font-medium">
                      {images.length || 1} project {images.length === 1 ? "image" : "images"}
                    </dd>
                  </div>
                </dl>
                <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
                  <h2 className="text-lg font-semibold">Project Overview</h2>
                  <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ProjectCta />
      </main>
      <Footer />
    </>
  );
}
