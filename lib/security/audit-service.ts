import { supabase } from '@/lib/db/supabase';
import { AccessLogger } from './access-logger';
import { getDeviceInfo } from './device-info';

export class AuditService {
  static async logSecurityEvent(
    doctorId: string,
    eventType: 'auth' | 'data_access' | 'security_change',
    details: Record<string, any>
  ) {
    try {
      const deviceInfo = getDeviceInfo();
      
      await Promise.all([
        // Log to audit_logs table
        supabase.from('audit_logs').insert({
          user_id: doctorId,
          action_type: eventType,
          table_name: 'security_events',
          record_id: crypto.randomUUID(),
          metadata: {
            ...details,
            device_info: deviceInfo
          }
        }),
        
        // Log access for security monitoring
        AccessLogger.logAccess(doctorId, eventType, 'success', details)
      ]);
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  static async getSecurityEvents(doctorId: string, options: {
    startDate?: Date;
    endDate?: Date;
    eventType?: string;
    limit?: number;
  } = {}) {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', doctorId)
      .order('timestamp', { ascending: false });

    if (options.startDate) {
      query = query.gte('timestamp', options.startDate.toISOString());
    }

    if (options.endDate) {
      query = query.lte('timestamp', options.endDate.toISOString());
    }

    if (options.eventType) {
      query = query.eq('action_type', options.eventType);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}