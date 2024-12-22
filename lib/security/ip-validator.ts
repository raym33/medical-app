import { supabase } from '@/lib/db/supabase';

export class IPValidator {
  static async isAllowedIP(doctorId: string, ip: string): Promise<boolean> {
    const { data } = await supabase
      .from('doctor_security_settings')
      .select('allowed_ips')
      .eq('id', doctorId)
      .single();

    if (!data?.allowed_ips?.length) return true;
    return data.allowed_ips.includes(ip);
  }

  static async addAllowedIP(doctorId: string, ip: string): Promise<void> {
    const { data } = await supabase
      .from('doctor_security_settings')
      .select('allowed_ips')
      .eq('id', doctorId)
      .single();

    const allowedIps = data?.allowed_ips || [];
    if (!allowedIps.includes(ip)) {
      await supabase
        .from('doctor_security_settings')
        .update({ allowed_ips: [...allowedIps, ip] })
        .eq('id', doctorId);
    }
  }
}