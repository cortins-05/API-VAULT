"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function logout() {
  try {
    const headersList = await headers();

    await auth.api.signOut({
      headers: headersList,
    });
    
    revalidatePath("/");
    revalidatePath("/profile");
    
    return { success: true };
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
}
