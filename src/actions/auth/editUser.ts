"use server";

import fs from "fs/promises";
import path from "path";
import { getSessionUser } from "./getUserId";

export async function uploadPhotoAction(formData: FormData) {
  const file = formData.get("photo") as File | null;

  if (!file) throw new Error("No se recibió archivo");
  if (!file.type.startsWith("image/")) throw new Error("Archivo no válido");
  if (file.size > 5 * 1024 * 1024) throw new Error("Imagen demasiado grande");

  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

  const uploadDir = path.join(process.cwd(), "public/userPhotos");

  
  if (user.image) {
    try {
      
      const oldFileName = path.basename(user.image);
      const oldFilePath = path.join(uploadDir, oldFileName);

      await fs.unlink(oldFilePath);
    } catch (err) {
      
      console.warn("No se pudo borrar la imagen anterior:", err);
    }
  }

  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop();
  const fileName = `${user.id}.${ext}`; 

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, fileName), buffer);

  return {
    url: `/userPhotos/${fileName}`,
  };
}