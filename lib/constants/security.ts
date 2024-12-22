export const SECURITY_CONFIG = {
  session: {
    maxAge: 30 * 60 * 1000, // 30 minutes
    renewThreshold: 5 * 60 * 1000, // 5 minutes before expiry
    maxConcurrent: 3, // Maximum concurrent sessions
  },
  password: {
    minLength: 12,
    requireNumbers: true,
    requireSpecialChars: true,
    requireUppercase: true,
    requireLowercase: true,
    expiryDays: 90,
    historySize: 5, // Number of previous passwords to remember
  },
  mfa: {
    issuer: 'Medical App',
    digits: 6,
    period: 30,
    backupCodesCount: 10,
  },
  rateLimit: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDuration: 60 * 60 * 1000, // 1 hour
  },
  encryption: {
    algorithm: 'aes-256-gcm',
    keySize: 32,
    ivSize: 16,
    saltSize: 16,
  },
} as const;