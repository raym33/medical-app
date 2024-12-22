"use client";

import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function toast({ title, description, variant = "default" }: ToastOptions) {
  const toastFn = variant === "destructive" ? sonnerToast.error : sonnerToast;
  toastFn(title, { description });
}

export function useToast() {
  return { toast };
}