"use client";

import { cn } from "@/lib/utils";

type InputGhostProps = {
  value: string;
  onChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">;

export default function InputGhost({
  value,
  onChange,
  className,
  ...props
}: InputGhostProps) {
  return (
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        `
        flex h-9 w-full rounded-md
        bg-transparent
        transition-colors
        placeholder:text-muted-foreground
        focus-visible:outline-none
        focus-visible:ring-0
        focus-visible:ring-offset-0
        disabled:cursor-not-allowed
        disabled:opacity-50
        `,
        className
      )}
    />
  );
}
