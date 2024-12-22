import { supabase } from '@/lib/db/supabase';
import { SECURITY_CONFIG } from '@/lib/constants/security';
import { AuditService } from './audit-service';
import { EncryptionService } from './encryption';

export class PasswordPolicy {
  private static encryption = EncryptionService.getInstance();

  static async enforcePasswordPolicy(doctorId: string): Promise<{
    requiresChange: boolean;
    reason?: string;
  }> {
    const { data } = await supabase
      .from('doctor_security_settings')
      .select('last_password_change')
      .eq('id', doctorId)
      .single();

    if (!data) return { requiresChange: true, reason: 'Security settings not found' };

    const lastChange = new Date(data.last_password_change);
    const daysSinceChange = Math.floor(
      (Date.now() - lastChange.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceChange >= SECURITY_CONFIG.password.expiryDays) {
      await AuditService.logSecurityEvent(doctorId, 'security_change', {
        type: 'password_expired',
        daysSinceChange
      });
      return { 
        requiresChange: true, 
        reason: 'Password has expired. Please update your password.' 
      };
    }

    return { requiresChange: false };
  }

  static async updatePassword(
    doctorId: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify current password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: '', // Get from context
        password: currentPassword
      });

      if (authError) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      // Update security settings
      await supabase
        .from('doctor_security_settings')
        .update({ 
          last_password_change: new Date().toISOString(),
          password_history: supabase.sql`array_append(password_history, ${
            this.encryption.encrypt(newPassword)
          })`
        })
        .eq('id', doctorId);

      await AuditService.logSecurityEvent(doctorId, 'security_change', {
        type: 'password_updated'
      });

      return { success: true };
    } catch (error) {
      console.error('Password update error:', error);
      return { 
        success: false, 
        error: 'Failed to update password. Please try again.' 
      };
    }
  }
}