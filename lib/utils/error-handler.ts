import { toast } from '@/hooks/use-toast';

export function handleError(error: unknown, title = 'Error') {
  console.error(error);
  
  const message = error instanceof Error 
    ? error.message 
    : 'An unexpected error occurred';

  toast({
    variant: "destructive",
    title,
    description: message,
  });
}