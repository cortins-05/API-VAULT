"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function logout() {
  await auth.api.signOut({
    headers: {
      cookie: cookies().toString(),
    },
  });
  
  revalidatePath("/", "layout");
}
