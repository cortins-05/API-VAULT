"use client";

import { logout } from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function cerrarSesion() {
    try {
      setIsLoading(true);
      const result = await logout();
      
      if (result.success) {
        router.refresh();
        router.push("/auth/login");
      } else {
        console.error("Error al cerrar sesión:", result.error);
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={cerrarSesion}
      className="cursor-pointer mb-5 mx-5"
      disabled={isLoading}
    >
      {isLoading ? "Cerrando..." : "Logout"}
    </Button>
  );
}
