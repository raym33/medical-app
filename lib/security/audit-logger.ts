import { supabase } from '@/lib/db/supabase';

export type AuditAction = 'create' | 'read' | 'update' | 'delete';
export type AuditResource = 'patient' | 'voice_note' | 'medication' | 'document';

interface AuditLogEntry {
  userId: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId: string;
  details?: Record<string, any>;
}

export async function logAuditEvent({
  userId,
  action,
  resource,
  resourceId,
  details
}: AuditLogEntry) {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert([{
        user_id: userId,
        action_type: action,
        table_name: resource,
        record_id: resourceId,
        metadata: details
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Don't throw - we don't want to break the main flow if logging fails
  }
}