import { supabase } from './supabase';

export interface AuditLog {
  id: string;
  user_id: string;
  action_type: string;
  table_name: string;
  record_id: string;
  timestamp: string;
  ip_address: string | null;
}

export async function getAuditLogs(
  options: {
    userId?: string;
    tableName?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  } = {}
): Promise<AuditLog[]> {
  let query = supabase
    .from('audit_logs')
    .select('*')
    .order('timestamp', { ascending: false });

  if (options.userId) {
    query = query.eq('user_id', options.userId);
  }

  if (options.tableName) {
    query = query.eq('table_name', options.tableName);
  }

  if (options.startDate) {
    query = query.gte('timestamp', options.startDate.toISOString());
  }

  if (options.endDate) {
    query = query.lte('timestamp', options.endDate.toISOString());
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}