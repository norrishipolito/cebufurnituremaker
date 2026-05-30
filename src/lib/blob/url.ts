export interface AssetUrlSource {
  blob_url?: string | null;
  blob_pathname?: string | null;
}

export function getAssetDeliveryUrl(asset?: AssetUrlSource | null) {
  const storedUrl = asset?.blob_url?.trim() ?? "";

  if (/^https?:\/\//i.test(storedUrl)) {
    return storedUrl;
  }

  if (asset?.blob_pathname) {
    return `/api/blob/${asset.blob_pathname}`;
  }

  return storedUrl;
}
