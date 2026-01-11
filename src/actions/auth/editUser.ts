"use server";

import { put, del } from "@vercel/blob";
import { getSessionUser } from "./getUserId";

function isVercelBlobUrl(url: string) {
  try {
    const u = new URL(url);
    return (
      u.hostname.endsWith("blob.vercel-storage.com") ||
      u.hostname.endsWith("r2.dev") ||
      u.hostname.includes("vercel-storage")
    );
  } catch {
    return false;
  }
}

function getExtensionFromName(name: string) {
  const parts = name.split(".");
  return parts.length > 1 ? `.${parts.pop()}` : "";
}

export async function uploadPhotoAction(formData: FormData) {
  const file = formData.get("photo") as File | null;

  if (!file) throw new Error("No se recibió archivo");
  if (!file.type.startsWith("image/")) throw new Error("Archivo no válido");
  if (file.size > 5 * 1024 * 1024) throw new Error("Imagen demasiado grande");

  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

  // Si la imagen anterior está en Vercel Blob, intentamos borrarla
  if (user.image && isVercelBlobUrl(user.image)) {
    try {
      await del(user.image);
    } catch (err) {
      console.warn("No se pudo borrar la imagen anterior en Blob:", err);
    }
  }

  // Subimos la nueva imagen a Vercel Blob (acceso público)
  const ext = getExtensionFromName(file.name);
  const blobPath = `userPhotos/${user.id}-${Date.now()}${ext}`;

  const res = await put(blobPath, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });

  return {
    url: res.url,
  };
}