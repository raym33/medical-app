import { SECURITY_CONFIG } from '@/lib/constants/security';

class RateLimiter {
  private attempts: Map<string, { count: number; timestamp: number }> = new Map();

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, timestamp: now });
      return false;
    }

    if (now - attempt.timestamp > SECURITY_CONFIG.rateLimit.windowMs) {
      this.attempts.set(key, { count: 1, timestamp: now });
      return false;
    }

    if (attempt.count >= SECURITY_CONFIG.rateLimit.maxAttempts) {
      return true;
    }

    attempt.count++;
    return false;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();