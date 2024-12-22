"use client";

import { useState, useCallback } from "react";
import { useErrorHandler } from "./use-error-handler";

interface AsyncOptions {
  errorTitle?: string;
  silentError?: boolean;
  onSuccess?: () => void;
}

export function useAsync<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  options: AsyncOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const handleError = useErrorHandler();

  const execute = useCallback(async (...args: Parameters<T>) => {
    try {
      setIsLoading(true);
      const result = await asyncFn(...args);
      options.onSuccess?.();
      return result;
    } catch (error) {
      handleError(error, {
        title: options.errorTitle,
        silent: options.silentError,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFn, handleError, options]);

  return {
    execute,
    isLoading,
  };
}