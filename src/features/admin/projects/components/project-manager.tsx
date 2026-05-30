"use client";

import { useRef, useState } from "react";
import { GripVertical, ImagePlus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAssetDeliveryUrl } from "@/lib/blob/url";
import { cn } from "@/lib/utils";

interface ProjectAsset {
  id: string;
  blob_url: string;
  blob_pathname: string;
  alt_text: string;
}

export interface AdminProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  group: string;
  primary_asset_id?: string | null;
  sort_order: number;
  published: boolean;
  image?: string;
  primary_asset?: ProjectAsset | null;
  images?: ProjectAsset[];
  editable?: boolean;
}

interface ProjectDraft {
  slug: string;
  title: string;
  description: string;
  category: string;
  primary_asset_id?: string | null;
  published: boolean;
}

interface ProjectManagerProps {
  initialProjects: AdminProject[];
  source: "database" | "default";
}

const internalProjectGroup = "projects";
const imageTypes = "image/jpeg,image/png,image/webp,image/avif";

function toDraft(project: AdminProject): ProjectDraft {
  return {
    slug: project.slug,
    title: project.title,
    description: project.description,
    category: project.category,
    primary_asset_id: project.primary_asset_id ?? null,
    published: project.published,
  };
}

function sortProjects(projects: AdminProject[]) {
  return [...projects].sort((a, b) => a.sort_order - b.sort_order);
}

async function parseJsonResponse(response: Response) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = payload?.detail ?? payload?.details ?? payload?.hint;
    throw new Error(
      detail
        ? `${payload?.error ?? "Request failed."} ${detail}`
        : payload?.error ?? "Request failed."
    );
  }

  return payload;
}

async function uploadProjectImage(file: File, altText: string) {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("alt_text", altText);

  const response = await fetch("/api/admin/assets/upload", {
    method: "POST",
    body: formData,
  });
  const payload = await parseJsonResponse(response);

  return payload.asset as ProjectAsset;
}

async function uploadProjectImages(files: File[], altText: string) {
  const uploadedAssets: ProjectAsset[] = [];

  for (const file of files) {
    uploadedAssets.push(await uploadProjectImage(file, altText));
  }

  return uploadedAssets;
}

function getImageUrl(project: AdminProject) {
  const asset = project.images?.[0] ?? project.primary_asset;

  if (!asset) {
    return project.image ?? "";
  }

  return getAssetUrl(asset);
}

function getAssetUrl(asset: ProjectAsset) {
  return getAssetDeliveryUrl(asset);
}

function getProjectImages(project: AdminProject) {
  if (project.images?.length) {
    return project.images;
  }

  return project.primary_asset ? [project.primary_asset] : [];
}

function AdminField({
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

export function ProjectManager({ initialProjects, source }: ProjectManagerProps) {
  const [projects, setProjects] = useState(() => sortProjects(initialProjects));
  const [drafts, setDrafts] = useState<Record<string, ProjectDraft>>(() =>
    Object.fromEntries(initialProjects.map((project) => [project.id, toDraft(project)]))
  );
  const [status, setStatus] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragSnapshotRef = useRef<AdminProject[] | null>(null);
  const dragDroppedRef = useRef(false);

  function updateDraft(id: string, patch: Partial<ProjectDraft>) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...patch,
      },
    }));
  }

  async function createProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const files = form
      .getAll("images")
      .filter((file): file is File => file instanceof File && file.size > 0);
    const title = String(form.get("title") ?? "").trim();
    const altText = String(form.get("image_alt_text") ?? "").trim();

    setStatus("Saving project...");
    setBusyId("new");

    try {
      let uploadedAssets: ProjectAsset[] = [];

      if (files.length > 0) {
        if (!altText) {
          throw new Error("Image alt text is required when uploading project images.");
        }

        uploadedAssets = await uploadProjectImages(files, altText);
      }

      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: String(form.get("slug") ?? ""),
          title,
          description: String(form.get("description") ?? ""),
          category: String(form.get("category") ?? ""),
          group: internalProjectGroup,
          primary_asset_id: uploadedAssets[0]?.id ?? null,
          asset_ids: uploadedAssets.map((asset) => asset.id),
          sort_order: projects.length,
          published: form.get("published") === "on",
        }),
      });
      const payload = await parseJsonResponse(response);
      const project = {
        ...payload.project,
        primary_asset: uploadedAssets[0] ?? null,
        images: uploadedAssets,
        editable: true,
      } as AdminProject;

      setProjects((current) => [...current, project]);
      setDrafts((current) => ({ ...current, [project.id]: toDraft(project) }));
      formElement.reset();
      setStatus("Project created");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to create project.");
    } finally {
      setBusyId(null);
    }
  }

  async function saveProject(id: string) {
    const draft = drafts[id];
    const current = projects.find((project) => project.id === id);

    if (!draft || !current) {
      return;
    }

    const fileInput = document.getElementById(`project-images-${id}`) as HTMLInputElement | null;
    const altInput = document.getElementById(`project-image-alt-${id}`) as HTMLInputElement | null;
    const files = Array.from(fileInput?.files ?? []);
    const altText = altInput?.value.trim() ?? "";

    setBusyId(id);
    setStatus("Saving project...");

    try {
      let projectImages = getProjectImages(current);

      if (files.length > 0) {
        if (!altText) {
          throw new Error("Image alt text is required when uploading project images.");
        }

        const uploadedAssets = await uploadProjectImages(files, altText);
        projectImages = [...projectImages, ...uploadedAssets];
      }

      const assetIds = projectImages.map((asset) => asset.id);
      const primaryAsset = projectImages[0] ?? null;

      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          group: internalProjectGroup,
          primary_asset_id: primaryAsset?.id ?? null,
          asset_ids: assetIds,
        }),
      });
      const payload = await parseJsonResponse(response);
      const updatedProject = {
        ...payload.project,
        primary_asset: primaryAsset,
        images: projectImages,
        editable: true,
      } as AdminProject;

      setProjects((currentProjects) =>
        currentProjects.map((project) => (project.id === id ? updatedProject : project))
      );
      setDrafts((currentDrafts) => ({ ...currentDrafts, [id]: toDraft(updatedProject) }));

      if (fileInput) {
        fileInput.value = "";
      }

      setStatus("Project saved");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save project.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteProject(project: AdminProject) {
    if (!project.editable) {
      setStatus("Default placeholder projects are removed by adding database projects.");
      return;
    }

    if (!window.confirm(`Delete "${project.title}"?`)) {
      return;
    }

    setBusyId(project.id);
    setStatus("Deleting project...");

    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "DELETE",
      });
      await parseJsonResponse(response);

      setProjects((current) =>
        current
          .filter((item) => item.id !== project.id)
          .map((item, index) => ({ ...item, sort_order: index }))
      );
      setDrafts((current) => {
        const next = { ...current };
        delete next[project.id];
        return next;
      });
      setStatus("Project deleted");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete project.");
    } finally {
      setBusyId(null);
    }
  }

  async function removeProjectImage(project: AdminProject, assetId: string) {
    if (!project.editable) {
      setStatus("Default placeholder project images cannot be edited directly.");
      return;
    }

    const remainingImages = getProjectImages(project).filter((asset) => asset.id !== assetId);

    setBusyId(project.id);
    setStatus("Removing project image...");

    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primary_asset_id: remainingImages[0]?.id ?? null,
          asset_ids: remainingImages.map((asset) => asset.id),
        }),
      });
      const payload = await parseJsonResponse(response);
      const updatedProject = {
        ...project,
        ...payload.project,
        primary_asset: remainingImages[0] ?? null,
        images: remainingImages,
        editable: true,
      } as AdminProject;

      setProjects((currentProjects) =>
        currentProjects.map((item) => (item.id === project.id ? updatedProject : item))
      );
      setDrafts((currentDrafts) => ({ ...currentDrafts, [project.id]: toDraft(updatedProject) }));
      setStatus("Project image removed");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to remove project image.");
    } finally {
      setBusyId(null);
    }
  }

  async function persistOrder(orderedProjects: AdminProject[]) {
    const editableProjects = orderedProjects.filter((project) => project.editable);

    await Promise.all(
      editableProjects.map((project, index) =>
        fetch(`/api/admin/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: index }),
        }).then(parseJsonResponse)
      )
    );
  }

  function reorderProjects(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      return;
    }

    const fromIndex = projects.findIndex((project) => project.id === draggedId);
    const toIndex = projects.findIndex((project) => project.id === targetId);

    if (fromIndex < 0 || toIndex < 0) {
      return;
    }

    const orderedProjects = [...projects];
    const [movedProject] = orderedProjects.splice(fromIndex, 1);
    orderedProjects.splice(toIndex, 0, movedProject);
    const normalizedProjects = orderedProjects.map((project, index) => ({
      ...project,
      sort_order: index,
    }));

    setProjects(normalizedProjects);
  }

  function startDragging(projectId: string) {
    dragSnapshotRef.current = projects;
    dragDroppedRef.current = false;
    setDraggedId(projectId);
    setDragOverId(projectId);
  }

  function previewMove(targetId: string) {
    if (dragOverId === targetId) {
      return;
    }

    setDragOverId(targetId);
    reorderProjects(targetId);
  }

  async function finishMove() {
    const orderedProjects = projects;

    dragDroppedRef.current = true;
    setDraggedId(null);
    setDragOverId(null);
    setBusyId("sorting");
    setStatus("Saving project order...");

    try {
      await persistOrder(orderedProjects);
      setStatus("Project order saved");
    } catch (error) {
      if (dragSnapshotRef.current) {
        setProjects(dragSnapshotRef.current);
      }
      setStatus(error instanceof Error ? error.message : "Unable to save project order.");
    } finally {
      dragSnapshotRef.current = null;
      setBusyId(null);
    }
  }

  function cancelMove() {
    if (!dragDroppedRef.current && dragSnapshotRef.current) {
      setProjects(dragSnapshotRef.current);
    }

    dragSnapshotRef.current = null;
    dragDroppedRef.current = false;
    setDraggedId(null);
    setDragOverId(null);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createProject} className="grid gap-3 rounded-lg border p-4 md:grid-cols-2">
        <AdminField label="Project title">
          <Input name="title" placeholder="Title (ex. Narra Dining Table)" required />
        </AdminField>
        <AdminField label="Project slug">
          <Input name="slug" placeholder="Slug (ex. narra-dining-table)" required />
        </AdminField>
        <AdminField label="Project category">
          <Input name="category" placeholder="Category (ex. Dining Room)" required />
        </AdminField>
        <AdminField label="Project image upload">
          <Input
            name="images"
            type="file"
            accept={imageTypes}
            multiple
            aria-label="Project image upload"
          />
        </AdminField>
        <AdminField label="Shared image alt text">
          <Input
            name="image_alt_text"
            placeholder="Image alt text (ex. Narra dining table in a Cebu showroom)"
          />
        </AdminField>
        <label className="flex h-9 items-center gap-2 text-sm">
          <input name="published" type="checkbox" defaultChecked />
          Show in Projects section
        </label>
        <AdminField label="Project description" className="md:col-span-2">
          <textarea
            name="description"
            placeholder="Description (ex. Solid wood table with hand-finished edges.)"
            required
            className="min-h-24 rounded-md border bg-transparent px-3 py-2 text-sm"
          />
        </AdminField>
        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
          <Button type="submit" disabled={busyId === "new"}>
            <ImagePlus />
            Create Project
          </Button>
          {status ? <p className="text-sm text-gray-600">{status}</p> : null}
        </div>
      </form>

      <div className="rounded-lg border bg-white dark:bg-gray-900">
        <div className="border-b p-4 text-sm text-gray-600">
          Source: {source}. Drag project handles to reorder saved database projects.
        </div>
        <div className="divide-y">
          {projects.map((project) => {
            const draft = drafts[project.id] ?? toDraft(project);
            const imageUrl = getImageUrl(project);
            const projectImages = getProjectImages(project);
            const isDragging = draggedId === project.id;
            const isDragTarget = dragOverId === project.id && draggedId !== project.id;

            return (
              <section
                key={project.id}
                data-testid="project-row"
                data-project-slug={project.slug}
                data-drag-state={
                  isDragging ? "dragging" : isDragTarget ? "target" : "idle"
                }
                onDragOver={(event) => {
                  event.preventDefault();
                  previewMove(project.id);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  finishMove();
                }}
                className={cn(
                  "grid gap-4 p-4 transition-all duration-200 ease-out lg:grid-cols-[auto_144px_1fr_auto]",
                  isDragging &&
                    "scale-[0.99] bg-amber-50/70 opacity-75 shadow-lg ring-2 ring-amber-300 dark:bg-amber-950/20 dark:ring-amber-600",
                  isDragTarget &&
                    "bg-gray-50 shadow-inner ring-2 ring-gray-300 dark:bg-gray-800/70 dark:ring-gray-600"
                )}
              >
                <button
                  type="button"
                  draggable={project.editable}
                  aria-label={`Drag ${project.title}`}
                  aria-grabbed={isDragging}
                  title="Drag to sort"
                  onDragStart={() => startDragging(project.id)}
                  onDragEnd={cancelMove}
                  disabled={!project.editable || busyId === "sorting"}
                  className={cn(
                    "flex h-10 w-10 cursor-grab items-center justify-center rounded-md border text-gray-500 transition-colors active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40",
                    isDragging && "border-amber-400 bg-amber-100 text-amber-800"
                  )}
                >
                  <GripVertical className="size-4" />
                </button>

                <div className="space-y-2">
                  <div className="h-28 overflow-hidden rounded-md border bg-gray-100 dark:bg-gray-800">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={projectImages[0]?.alt_text ?? project.primary_asset?.alt_text ?? project.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-500">
                        No image attached
                      </div>
                    )}
                  </div>
                  {projectImages.length ? (
                    <div className="grid grid-cols-3 gap-2" aria-label={`${project.title} images`}>
                      {projectImages.map((asset, index) => (
                        <div
                          key={asset.id}
                          className="group relative aspect-square overflow-hidden rounded-md border bg-gray-100 dark:bg-gray-800"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getAssetUrl(asset)}
                            alt={asset.alt_text}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                            {index + 1}
                          </span>
                          {project.editable ? (
                            <button
                              type="button"
                              onClick={() => removeProjectImage(project, asset.id)}
                              disabled={busyId === project.id}
                              className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-white/90 text-gray-800 opacity-0 shadow transition group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                              aria-label={`Remove image ${index + 1} from ${project.title}`}
                            >
                              <Trash2 className="size-3" />
                            </button>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    value={draft.title}
                    onChange={(event) => updateDraft(project.id, { title: event.target.value })}
                    placeholder="Title (ex. Narra Dining Table)"
                    disabled={!project.editable}
                  />
                  <Input
                    value={draft.slug}
                    onChange={(event) => updateDraft(project.id, { slug: event.target.value })}
                    placeholder="Slug (ex. narra-dining-table)"
                    disabled={!project.editable}
                  />
                  <Input
                    value={draft.category}
                    onChange={(event) =>
                      updateDraft(project.id, { category: event.target.value })
                    }
                    placeholder="Category (ex. Dining Room)"
                    disabled={!project.editable}
                  />
                  <Input
                    id={`project-images-${project.id}`}
                    type="file"
                    accept={imageTypes}
                    multiple
                    aria-label={`Upload images for ${project.title}`}
                    disabled={!project.editable}
                  />
                  <Input
                    id={`project-image-alt-${project.id}`}
                    placeholder="Image alt text (ex. Close-up of woven chair detail)"
                    defaultValue={project.primary_asset?.alt_text ?? ""}
                    disabled={!project.editable}
                  />
                  <textarea
                    value={draft.description}
                    onChange={(event) =>
                      updateDraft(project.id, { description: event.target.value })
                    }
                    placeholder="Description (ex. Solid wood table with hand-finished edges.)"
                    disabled={!project.editable}
                    className="min-h-24 rounded-md border bg-transparent px-3 py-2 text-sm disabled:opacity-60 md:col-span-2"
                  />
                  <label className="flex h-9 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={draft.published}
                      onChange={(event) =>
                        updateDraft(project.id, { published: event.target.checked })
                      }
                      disabled={!project.editable}
                    />
                    Show in Projects section
                  </label>
                </div>

                <div className="flex flex-row gap-2 lg:flex-col">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => saveProject(project.id)}
                    disabled={!project.editable || busyId === project.id}
                  >
                    <Save />
                    Save
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteProject(project)}
                    disabled={!project.editable || busyId === project.id}
                  >
                    <Trash2 />
                    Delete
                  </Button>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
