"use client";

import { useEffect } from "react";

interface Props {
  enabled: boolean;
}

export function ReloadGuard({enabled}: Props) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // obligatorio
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [enabled]);

  return null;
}