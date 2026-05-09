"use client";

import { Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface AdminAsset {
  id: string;
  blob_url: string;
  blob_pathname: string;
  alt_text: string;
  content_type: string;
  size_bytes: number;
}

interface MediaManagerProps {
  initialAssets: AdminAsset[];
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

function getAssetUrl(asset: AdminAsset) {
  return asset.blob_pathname ? `/api/blob/${asset.blob_pathname}` : asset.blob_url;
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaManager({ initialAssets }: MediaManagerProps) {
  const [assets, setAssets] = useState(initialAssets);
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(initialAssets.map((asset) => [asset.id, asset.alt_text]))
  );
  const [status, setStatus] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function updateDraft(id: string, value: string) {
    setDrafts((current) => ({ ...current, [id]: value }));
  }

  async function saveAsset(id: string) {
    setBusyId(id);
    setStatus("Saving asset...");

    try {
      const response = await fetch(`/api/admin/assets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt_text: drafts[id] ?? "" }),
      });
      const payload = await parseJsonResponse(response);
      const asset = payload.asset as AdminAsset;

      setAssets((current) =>
        current.map((item) => (item.id === id ? asset : item))
      );
      setDrafts((current) => ({ ...current, [id]: asset.alt_text }));
      setStatus("Asset saved");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save asset.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteAsset(asset: AdminAsset) {
    if (!window.confirm(`Delete "${asset.alt_text}"?`)) {
      return;
    }

    setBusyId(asset.id);
    setStatus("Deleting asset...");

    try {
      const response = await fetch(`/api/admin/assets/${asset.id}`, {
        method: "DELETE",
      });
      await parseJsonResponse(response);

      setAssets((current) => current.filter((item) => item.id !== asset.id));
      setDrafts((current) => {
        const next = { ...current };
        delete next[asset.id];
        return next;
      });
      setStatus("Asset deleted");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete asset.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4 dark:bg-gray-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Assets</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Review uploaded project images, update alt text, or delete unused assets.
          </p>
        </div>
        {status ? <p className="text-sm text-gray-600">{status}</p> : null}
      </div>

      {assets.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {assets.map((asset) => (
            <section
              key={asset.id}
              data-asset-id={asset.id}
              className="grid gap-3 rounded-md border p-3 text-sm"
            >
              <a
                href={getAssetUrl(asset)}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-md border bg-gray-100 dark:bg-gray-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getAssetUrl(asset)}
                  alt={asset.alt_text}
                  className="h-40 w-full object-cover"
                />
              </a>
              <Input
                value={drafts[asset.id] ?? ""}
                onChange={(event) => updateDraft(asset.id, event.target.value)}
                placeholder="Alt text (ex. Custom narra dining table in workshop)"
                aria-label={`Alt text for ${asset.alt_text}`}
              />
              <p className="truncate text-xs text-gray-500">{asset.blob_url}</p>
              <p className="text-xs text-gray-500">
                {asset.content_type} - {formatFileSize(asset.size_bytes)}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => saveAsset(asset.id)}
                  disabled={busyId === asset.id}
                >
                  <Save />
                  Save
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteAsset(asset)}
                  disabled={busyId === asset.id}
                >
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          No uploaded assets yet. Upload project images from the Projects page.
        </p>
      )}
    </div>
  );
}
