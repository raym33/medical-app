import { authenticator } from 'otplib';
import { supabase } from '@/lib/db/supabase';
import { SECURITY_CONFIG } from '@/lib/constants/security';

export class MFAService {
  static async setupMFA(doctorId: string): Promise<string> {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(
      doctorId,
      SECURITY_CONFIG.mfa.issuer,
      secret
    );

    await supabase
      .from('doctor_security_settings')
      .update({ 
        mfa_secret: secret,
        mfa_enabled: true 
      })
      .eq('id', doctorId);

    return otpauth;
  }

  static async verifyToken(doctorId: string, token: string): Promise<boolean> {
    const { data } = await supabase
      .from('doctor_security_settings')
      .select('mfa_secret')
      .eq('id', doctorId)
      .single();

    if (!data?.mfa_secret) return false;

    return authenticator.verify({
      token,
      secret: data.mfa_secret
    });
  }
}