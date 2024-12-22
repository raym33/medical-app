"use client";

import { Toaster } from "sonner";

export function Toast() {
  return (
    <Toaster 
      position="bottom-right"
      toastOptions={{
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
        },
      }}
    />
  );
}