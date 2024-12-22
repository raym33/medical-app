import { supabase } from '@/lib/db/supabase';
import { APP_CONFIG } from '@/lib/constants/config';
import { getDeviceInfo } from './device-info';

export class SessionManager {
  private static instance: SessionManager;

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  async createSession(doctorId: string): Promise<string> {
    const deviceInfo = getDeviceInfo();
    const expiresAt = new Date(Date.now() + APP_CONFIG.auth.sessionTimeout);

    const { data, error } = await supabase
      .from('doctor_sessions')
      .insert({
        doctor_id: doctorId,
        device_info: deviceInfo,
        ip_address: await this.getClientIP(),
        expires_at: expiresAt.toISOString()
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async validateSession(sessionId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('doctor_sessions')
      .select('expires_at')
      .eq('id', sessionId)
      .single();

    if (error || !data) return false;
    return new Date(data.expires_at) > new Date();
  }

  async extendSession(sessionId: string): Promise<void> {
    const expiresAt = new Date(Date.now() + APP_CONFIG.auth.sessionTimeout);

    const { error } = await supabase
      .from('doctor_sessions')
      .update({
        last_active: new Date().toISOString(),
        expires_at: expiresAt.toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return '0.0.0.0';
    }
  }
}