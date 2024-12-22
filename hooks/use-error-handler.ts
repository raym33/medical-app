"use client";

import { useToast } from "./use-toast";

interface ErrorOptions {
  title?: string;
  silent?: boolean;
}

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = (error: unknown, options: ErrorOptions = {}) => {
    console.error(error);

    if (options.silent) return;

    const title = options.title || "An error occurred";
    const description = error instanceof Error 
      ? error.message 
      : "Please try again later";

    toast({
      variant: "destructive",
      title,
      description,
    });
  };

  return handleError;
}