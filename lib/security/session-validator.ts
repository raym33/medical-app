import { SECURITY_CONFIG } from '@/lib/constants/security';
import { IPValidator } from './ip-validator';
import { AuditService } from './audit-service';
import { rateLimiter } from './rate-limiter';

export class SessionValidator {
  static async validateAccess(doctorId: string, ip: string): Promise<{
    valid: boolean;
    error?: string;
  }> {
    try {
      // Check rate limiting
      if (rateLimiter.isRateLimited(`${doctorId}:${ip}`)) {
        await AuditService.logSecurityEvent(doctorId, 'auth', {
          status: 'rate_limited',
          ip
        });
        return { valid: false, error: 'Too many requests. Please try again later.' };
      }

      // Validate IP
      const isAllowedIP = await IPValidator.isAllowedIP(doctorId, ip);
      if (!isAllowedIP) {
        await AuditService.logSecurityEvent(doctorId, 'auth', {
          status: 'ip_blocked',
          ip
        });
        return { valid: false, error: 'Access denied from this IP address.' };
      }

      // Check session limits
      const activeSessions = await this.getActiveSessions(doctorId);
      if (activeSessions.length >= SECURITY_CONFIG.session.maxConcurrent) {
        await AuditService.logSecurityEvent(doctorId, 'auth', {
          status: 'max_sessions_reached',
          activeCount: activeSessions.length
        });
        return { valid: false, error: 'Maximum number of active sessions reached.' };
      }

      return { valid: true };
    } catch (error) {
      console.error('Session validation error:', error);
      return { valid: false, error: 'An error occurred during validation.' };
    }
  }

  private static async getActiveSessions(doctorId: string) {
    const { data } = await supabase
      .from('doctor_sessions')
      .select('*')
      .eq('doctor_id', doctorId)
      .gt('expires_at', new Date().toISOString());
    
    return data || [];
  }
}