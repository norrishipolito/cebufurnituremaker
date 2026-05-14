import { AdminPageShell } from "../../_components/admin-page-shell";
import {
  MediaManager,
  type AdminAsset,
} from "@/features/admin/media/components/media-manager";
import { createDbClient } from "@/lib/db/client";
import { assets } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export default async function AdminMediaPage() {
  const db = createDbClient();
  const data = db
    ? await db.select().from(assets).orderBy(desc(assets.created_at))
    : null;

  return (
    <AdminPageShell
      title="Media"
      description="Review uploaded project images, update alt text, and delete unused assets. Uploading happens from the Projects page."
    >
      <MediaManager initialAssets={(data ?? []) as AdminAsset[]} />
    </AdminPageShell>
  );
}
