"use client";

import { supabase } from '@/lib/db/supabase';
import { toast } from '@/lib/utils/toast';
import { AccessLogger } from '@/lib/security/access-logger';

export async function handleDoctorLogin(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      await AccessLogger.logAccess(
        'unknown',
        'login_failed',
        'failure',
        { error: error.message }
      );
      throw new Error('Invalid login credentials');
    }

    await AccessLogger.logAccess(
      data.user.id,
      'login_success',
      'success'
    );

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function handleDoctorLogout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear any stored session data
    localStorage.removeItem('sessionId');
    sessionStorage.clear();

    await AccessLogger.logAccess(
      'unknown',
      'logout',
      'success'
    );
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function getCurrentDoctor() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session?.user || null;
  } catch (error) {
    console.error('Session check error:', error);
    return null;
  }
}