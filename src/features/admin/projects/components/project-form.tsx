"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProjectForm() {
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving...");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      slug: String(form.get("slug") ?? ""),
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      category: String(form.get("category") ?? ""),
      group: String(form.get("group") ?? "products"),
      sort_order: Number(form.get("sort_order") ?? 0),
      published: form.get("published") === "on",
    };

    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        const detail = result.detail ?? result.details ?? result.hint;
        throw new Error(
          detail
            ? `${result.error ?? "Unable to create project."} ${detail}`
            : result.error ?? "Unable to create project."
        );
      }

      formElement.reset();
      setStatus("Project created");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to create project.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border p-4 md:grid-cols-2">
      <Input name="title" placeholder="Title (ex. Narra Dining Table)" required />
      <Input name="slug" placeholder="Slug (ex. narra-dining-table)" required />
      <Input name="category" placeholder="Category (ex. Dining Room)" required />
      <Input name="sort_order" type="number" placeholder="Sort order (ex. 0)" defaultValue={0} />
      <Input
        name="group"
        list="project-group-examples"
        placeholder="Group (ex. Products, Showroom, Custom Builds)"
        required
      />
      <datalist id="project-group-examples">
        <option value="products" />
        <option value="showroom" />
        <option value="fabrication_site" />
        <option value="custom_builds" />
      </datalist>
      <label className="flex h-9 items-center gap-2 text-sm">
        <input name="published" type="checkbox" defaultChecked />
        Published
      </label>
      <textarea
        name="description"
        placeholder="Description (ex. Solid wood table with hand-finished edges.)"
        required
        className="min-h-24 rounded-md border bg-transparent px-3 py-2 text-sm md:col-span-2"
      />
      <div className="flex items-center gap-3 md:col-span-2">
        <Button type="submit">Create Project</Button>
        {status ? <p className="text-sm text-gray-600">{status}</p> : null}
      </div>
    </form>
  );
}
