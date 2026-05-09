import { put, del, get, type PutBlobResult } from "@vercel/blob";

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const maxImageSizeBytes = 5 * 1024 * 1024;
export type BlobAccess = "public" | "private";

export function getBlobAccess(): BlobAccess {
  return process.env.BLOB_ACCESS === "public" ? "public" : "private";
}

export function getBlobPublicUrl(blob: Pick<PutBlobResult, "pathname" | "url">) {
  if (getBlobAccess() === "public") {
    return blob.url;
  }

  return `/api/blob/${blob.pathname}`;
}

export function validateImageFile(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    return "Only JPEG, PNG, WebP, and AVIF images are allowed.";
  }

  if (file.size > maxImageSizeBytes) {
    return "Images must be 5 MB or smaller.";
  }

  return null;
}

function matchesSignature(bytes: Uint8Array, signature: number[]) {
  return signature.every((byte, index) => bytes[index] === byte);
}

function isIsoBaseMediaImage(bytes: Uint8Array) {
  if (bytes.length < 12) {
    return false;
  }

  const box = String.fromCharCode(...bytes.slice(4, 8));
  const brand = String.fromCharCode(...bytes.slice(8, 12));

  return box === "ftyp" && ["avif", "avis", "mif1", "heic"].includes(brand);
}

export async function validateImageFileContent(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  if (
    file.type === "image/jpeg" &&
    matchesSignature(bytes, [0xff, 0xd8, 0xff])
  ) {
    return null;
  }

  if (
    file.type === "image/png" &&
    matchesSignature(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  ) {
    return null;
  }

  if (
    file.type === "image/webp" &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    return null;
  }

  if (file.type === "image/avif" && isIsoBaseMediaImage(bytes)) {
    return null;
  }

  return "Uploaded file content does not match the declared image type.";
}

export async function uploadImageToBlob(file: File, pathname: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Vercel Blob token is missing.");
  }

  return put(pathname, file, {
    access: getBlobAccess(),
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

export async function getPrivateBlob(pathname: string, ifNoneMatch?: string | null) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Vercel Blob token is missing.");
  }

  return get(pathname, {
    access: "private",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    ifNoneMatch: ifNoneMatch ?? undefined,
  });
}

export async function deleteBlob(pathname: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Vercel Blob token is missing.");
  }

  await del(pathname, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}
