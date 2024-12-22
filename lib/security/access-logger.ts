import { supabase } from '@/lib/db/supabase';
import { getDeviceInfo } from './device-info';

export class AccessLogger {
  static async logAccess(
    doctorId: string,
    action: string,
    status: 'success' | 'failure',
    details?: Record<string, any>
  ) {
    try {
      await supabase.from('doctor_access_logs').insert({
        doctor_id: doctorId,
        action,
        status,
        device_info: getDeviceInfo(),
        details
      });
    } catch (error) {
      console.error('Failed to log access:', error);
    }
  }
}