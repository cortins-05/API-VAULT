"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function logout() {
  await auth.api.signOut();
  
  revalidatePath("/");
}
