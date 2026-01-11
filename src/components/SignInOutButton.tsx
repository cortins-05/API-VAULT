"use client";

import { logout } from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";
import { signOut } from "better-auth/api";
import { useRouter } from "next/navigation";

export default function SignInOutButton() {
  const router = useRouter();

  async function cerrarSesion() {
    await logout();
    await signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <Button
      variant="destructive"
      onClick={cerrarSesion}
      className="cursor-pointer"
    >
      Logout
    </Button>
  );
}
