import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentDoctor } from '@/lib/auth';
import { handleError } from './error-handler';

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentDoctor();
        if (!user) {
          router.push('/auth/login');
        }
      } catch (error) {
        handleError(error, 'Authentication failed');
        router.push('/auth/login');
      }
    }

    checkAuth();
  }, [router]);
}