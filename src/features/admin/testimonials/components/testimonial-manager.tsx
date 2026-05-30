"use client";

import { GripVertical, ImagePlus, Save, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { defaultTestimonialAvatar } from "@/lib/default-site-content";
import { getAssetDeliveryUrl } from "@/lib/blob/url";
import { cn } from "@/lib/utils";

interface TestimonialAsset {
  id: string;
  blob_url: string;
  blob_pathname: string;
  alt_text: string;
}

export interface AdminTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar_asset_id?: string | null;
  avatar?: TestimonialAsset | null;
  sort_order: number;
  published: boolean;
  editable?: boolean;
}

interface TestimonialDraft {
  name: string;
  role: string;
  quote: string;
  avatar_asset_id?: string | null;
  published: boolean;
}

const imageTypes = "image/jpeg,image/png,image/webp,image/avif";

interface TestimonialManagerProps {
  initialTestimonials: AdminTestimonial[];
  source: "database" | "default";
}

function toDraft(testimonial: AdminTestimonial): TestimonialDraft {
  return {
    name: testimonial.name,
    role: testimonial.role,
    quote: testimonial.quote,
    avatar_asset_id: testimonial.avatar_asset_id ?? null,
    published: testimonial.published,
  };
}

function sortTestimonials(testimonials: AdminTestimonial[]) {
  return [...testimonials].sort((a, b) => a.sort_order - b.sort_order);
}

async function parseJsonResponse(response: Response) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const issue = payload?.issues?.[0]?.message;
    const detail = payload?.detail ?? payload?.details ?? payload?.hint ?? issue;
    throw new Error(
      detail
        ? `${payload?.error ?? "Request failed."} ${detail}`
        : payload?.error ?? "Request failed."
    );
  }

  return payload;
}

async function uploadTestimonialAvatar(file: File, altText: string) {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("alt_text", altText);

  const response = await fetch("/api/admin/assets/upload", {
    method: "POST",
    body: formData,
  });
  const payload = await parseJsonResponse(response);

  return payload.asset as TestimonialAsset;
}

function getAssetUrl(asset: TestimonialAsset) {
  return getAssetDeliveryUrl(asset);
}

function getAvatarUrl(testimonial: AdminTestimonial) {
  return testimonial.avatar ? getAssetUrl(testimonial.avatar) : defaultTestimonialAvatar;
}

export function TestimonialManager({
  initialTestimonials,
  source,
}: TestimonialManagerProps) {
  const [testimonials, setTestimonials] = useState(() =>
    sortTestimonials(initialTestimonials)
  );
  const [drafts, setDrafts] = useState<Record<string, TestimonialDraft>>(() =>
    Object.fromEntries(
      initialTestimonials.map((testimonial) => [
        testimonial.id,
        toDraft(testimonial),
      ])
    )
  );
  const [status, setStatus] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragSnapshotRef = useRef<AdminTestimonial[] | null>(null);
  const dragDroppedRef = useRef(false);

  function updateDraft(id: string, patch: Partial<TestimonialDraft>) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...patch,
      },
    }));
  }

  async function createTestimonial(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const avatarFile = form.get("avatar");
    const name = String(form.get("name") ?? "").trim();
    const avatarAltText =
      String(form.get("avatar_alt_text") ?? "").trim() ||
      `${name || "Customer"} testimonial avatar`;

    setBusyId("new");
    setStatus("Saving testimonial...");

    try {
      const uploadedAvatar =
        avatarFile instanceof File && avatarFile.size > 0
          ? await uploadTestimonialAvatar(avatarFile, avatarAltText)
          : null;
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role: String(form.get("role") ?? ""),
          quote: String(form.get("quote") ?? ""),
          avatar_asset_id: uploadedAvatar?.id ?? null,
          sort_order: testimonials.length,
          published: form.get("published") === "on",
        }),
      });
      const payload = await parseJsonResponse(response);
      const testimonial = {
        ...payload.testimonial,
        avatar: uploadedAvatar,
        editable: true,
      } as AdminTestimonial;

      setTestimonials((current) => [...current, testimonial]);
      setDrafts((current) => ({
        ...current,
        [testimonial.id]: toDraft(testimonial),
      }));
      formElement.reset();
      setStatus("Testimonial created");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to create testimonial."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function saveTestimonial(id: string) {
    const draft = drafts[id];
    const current = testimonials.find((testimonial) => testimonial.id === id);

    if (!draft || !current) {
      return;
    }

    const fileInput = document.getElementById(
      `testimonial-avatar-${id}`
    ) as HTMLInputElement | null;
    const altInput = document.getElementById(
      `testimonial-avatar-alt-${id}`
    ) as HTMLInputElement | null;
    const avatarFile = fileInput?.files?.[0];
    const avatarAltText =
      altInput?.value.trim() || `${draft.name || "Customer"} testimonial avatar`;

    setBusyId(id);
    setStatus("Saving testimonial...");

    try {
      const uploadedAvatar = avatarFile
        ? await uploadTestimonialAvatar(avatarFile, avatarAltText)
        : null;
      const nextDraft = {
        ...draft,
        avatar_asset_id: uploadedAvatar?.id ?? draft.avatar_asset_id ?? null,
      };
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextDraft),
      });
      const payload = await parseJsonResponse(response);
      const testimonial = {
        ...payload.testimonial,
        avatar: uploadedAvatar ?? current.avatar ?? null,
        editable: true,
      } as AdminTestimonial;

      setTestimonials((current) =>
        sortTestimonials(
          current.map((item) => (item.id === id ? testimonial : item))
        )
      );
      setDrafts((current) => ({
        ...current,
        [testimonial.id]: toDraft(testimonial),
      }));
      if (fileInput) {
        fileInput.value = "";
      }
      setStatus("Testimonial saved");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save testimonial.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteTestimonial(testimonial: AdminTestimonial) {
    if (!testimonial.editable) {
      setStatus("Default placeholder testimonials are removed by adding database testimonials.");
      return;
    }

    if (!window.confirm(`Delete "${testimonial.name}"?`)) {
      return;
    }

    setBusyId(testimonial.id);
    setStatus("Deleting testimonial...");

    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: "DELETE",
      });
      await parseJsonResponse(response);

      setTestimonials((current) =>
        current
          .filter((item) => item.id !== testimonial.id)
          .map((item, index) => ({ ...item, sort_order: index }))
      );
      setDrafts((current) => {
        const next = { ...current };
        delete next[testimonial.id];
        return next;
      });
      setStatus("Testimonial deleted");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to delete testimonial."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function persistOrder(orderedTestimonials: AdminTestimonial[]) {
    const editableTestimonials = orderedTestimonials.filter(
      (testimonial) => testimonial.editable
    );

    await Promise.all(
      editableTestimonials.map((testimonial, index) =>
        fetch(`/api/admin/testimonials/${testimonial.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: index }),
        }).then(parseJsonResponse)
      )
    );
  }

  function reorderTestimonials(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      return;
    }

    const fromIndex = testimonials.findIndex((item) => item.id === draggedId);
    const toIndex = testimonials.findIndex((item) => item.id === targetId);

    if (fromIndex < 0 || toIndex < 0) {
      return;
    }

    const orderedTestimonials = [...testimonials];
    const [movedTestimonial] = orderedTestimonials.splice(fromIndex, 1);
    orderedTestimonials.splice(toIndex, 0, movedTestimonial);
    setTestimonials(
      orderedTestimonials.map((testimonial, index) => ({
        ...testimonial,
        sort_order: index,
      }))
    );
  }

  function startDragging(testimonialId: string) {
    dragSnapshotRef.current = testimonials;
    dragDroppedRef.current = false;
    setDraggedId(testimonialId);
    setDragOverId(testimonialId);
  }

  function previewMove(targetId: string) {
    if (dragOverId === targetId) {
      return;
    }

    setDragOverId(targetId);
    reorderTestimonials(targetId);
  }

  async function finishMove() {
    const orderedTestimonials = testimonials;

    dragDroppedRef.current = true;
    setDraggedId(null);
    setDragOverId(null);
    setBusyId("sorting");
    setStatus("Saving testimonial order...");

    try {
      await persistOrder(orderedTestimonials);
      setStatus("Testimonial order saved");
    } catch (error) {
      if (dragSnapshotRef.current) {
        setTestimonials(dragSnapshotRef.current);
      }
      setStatus(
        error instanceof Error ? error.message : "Unable to save testimonial order."
      );
    } finally {
      dragSnapshotRef.current = null;
      setBusyId(null);
    }
  }

  function cancelMove() {
    if (!dragDroppedRef.current && dragSnapshotRef.current) {
      setTestimonials(dragSnapshotRef.current);
    }

    dragSnapshotRef.current = null;
    dragDroppedRef.current = false;
    setDraggedId(null);
    setDragOverId(null);
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={createTestimonial}
        className="grid gap-3 rounded-lg border p-4 md:grid-cols-2"
      >
        <Input name="name" placeholder="Name (ex. Maria Santos)" required />
        <Input name="role" placeholder="Role (ex. Interior Designer)" required />
        <label className="grid gap-1.5 text-sm font-medium">
          <span>Avatar upload</span>
          <Input
            name="avatar"
            type="file"
            accept={imageTypes}
            aria-label="Testimonial avatar upload"
          />
        </label>
        <Input
          name="avatar_alt_text"
          placeholder="Avatar alt text (ex. Maria Santos testimonial portrait)"
        />
        <label className="flex h-9 items-center gap-2 text-sm">
          <input name="published" type="checkbox" defaultChecked />
          Show in Testimonials section
        </label>
        <textarea
          name="quote"
          placeholder="Quote (ex. The craftsmanship exceeded our expectations.)"
          required
          className="min-h-24 rounded-md border bg-transparent px-3 py-2 text-sm md:col-span-2"
        />
        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
          <Button type="submit" disabled={busyId === "new"}>
            <ImagePlus />
            Create Testimonial
          </Button>
          {status ? <p className="text-sm text-gray-600">{status}</p> : null}
        </div>
      </form>

      <div className="rounded-lg border bg-white dark:bg-gray-900">
        <div className="border-b p-4 text-sm text-gray-600">
          Source: {source}. Drag testimonial handles to reorder saved database testimonials.
        </div>
        <div className="divide-y">
          {testimonials.map((testimonial) => {
            const draft = drafts[testimonial.id] ?? toDraft(testimonial);
            const isDragging = draggedId === testimonial.id;
            const isDragTarget =
              dragOverId === testimonial.id && draggedId !== testimonial.id;

            return (
              <section
                key={testimonial.id}
                data-testid="testimonial-row"
                data-testimonial-name={testimonial.name}
                data-drag-state={
                  isDragging ? "dragging" : isDragTarget ? "target" : "idle"
                }
                onDragOver={(event) => {
                  event.preventDefault();
                  previewMove(testimonial.id);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  finishMove();
                }}
                className={cn(
                  "grid gap-4 p-4 transition-all duration-200 ease-out lg:grid-cols-[auto_96px_1fr_auto]",
                  isDragging &&
                    "scale-[0.99] bg-amber-50/70 opacity-75 shadow-lg ring-2 ring-amber-300 dark:bg-amber-950/20 dark:ring-amber-600",
                  isDragTarget &&
                    "bg-gray-50 shadow-inner ring-2 ring-gray-300 dark:bg-gray-800/70 dark:ring-gray-600"
                )}
              >
                <button
                  type="button"
                  draggable={testimonial.editable}
                  aria-label={`Drag ${testimonial.name}`}
                  aria-grabbed={isDragging}
                  title="Drag to sort"
                  onDragStart={() => startDragging(testimonial.id)}
                  onDragEnd={cancelMove}
                  disabled={!testimonial.editable || busyId === "sorting"}
                  className={cn(
                    "flex h-10 w-10 cursor-grab items-center justify-center rounded-md border text-gray-500 transition-colors active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40",
                    isDragging && "border-amber-400 bg-amber-100 text-amber-800"
                  )}
                >
                  <GripVertical className="size-4" />
                </button>

                <div className="space-y-2">
                  <div className="mx-auto size-20 overflow-hidden rounded-full border bg-gray-100 dark:bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getAvatarUrl(testimonial)}
                      alt={`${draft.name || testimonial.name} avatar`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {!testimonial.avatar ? (
                    <p className="text-center text-xs text-gray-500">
                      Default avatar
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    value={draft.name}
                    onChange={(event) =>
                      updateDraft(testimonial.id, { name: event.target.value })
                    }
                    placeholder="Name (ex. Maria Santos)"
                    disabled={!testimonial.editable}
                  />
                  <Input
                    value={draft.role}
                    onChange={(event) =>
                      updateDraft(testimonial.id, { role: event.target.value })
                    }
                    placeholder="Role (ex. Interior Designer)"
                    disabled={!testimonial.editable}
                  />
                  <textarea
                    value={draft.quote}
                    onChange={(event) =>
                      updateDraft(testimonial.id, { quote: event.target.value })
                    }
                    placeholder="Quote (ex. The craftsmanship exceeded our expectations.)"
                    disabled={!testimonial.editable}
                    className="min-h-24 rounded-md border bg-transparent px-3 py-2 text-sm disabled:opacity-60 md:col-span-2"
                  />
                  <Input
                    id={`testimonial-avatar-${testimonial.id}`}
                    type="file"
                    accept={imageTypes}
                    aria-label={`Upload avatar for ${testimonial.name}`}
                    disabled={!testimonial.editable}
                  />
                  <Input
                    id={`testimonial-avatar-alt-${testimonial.id}`}
                    placeholder="Avatar alt text (ex. Maria Santos testimonial portrait)"
                    defaultValue={testimonial.avatar?.alt_text ?? ""}
                    disabled={!testimonial.editable}
                  />
                  <label className="flex h-9 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={draft.published}
                      onChange={(event) =>
                        updateDraft(testimonial.id, {
                          published: event.target.checked,
                        })
                      }
                      disabled={!testimonial.editable}
                    />
                    Show in Testimonials section
                  </label>
                </div>

                <div className="flex flex-row gap-2 lg:flex-col">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => saveTestimonial(testimonial.id)}
                    disabled={!testimonial.editable || busyId === testimonial.id}
                  >
                    <Save />
                    Save
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteTestimonial(testimonial)}
                    disabled={!testimonial.editable || busyId === testimonial.id}
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
