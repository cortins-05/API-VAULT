"use client";

import { logout } from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignInOutButton() {
  const router = useRouter();

  async function cerrarSesion() {
    await logout();
    router.push("/");
  }

  return (
    <Button
      variant="destructive"
      onClick={cerrarSesion}
    >
      Logout
    </Button>
  );
}
