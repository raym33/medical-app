import { SECURITY_CONFIG } from '@/lib/constants/security';

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < SECURITY_CONFIG.password.minLength) {
    return {
      valid: false,
      error: `Password must be at least ${SECURITY_CONFIG.password.minLength} characters`
    };
  }

  if (SECURITY_CONFIG.password.requireNumbers && !/\d/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one number'
    };
  }

  if (SECURITY_CONFIG.password.requireSpecialChars && !/[!@#$%^&*]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one special character'
    };
  }

  return { valid: true };
}