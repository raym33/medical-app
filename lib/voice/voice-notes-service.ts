import { supabase } from '@/lib/db/supabase';
import { mockData } from '@/lib/db/mock-data';

export interface VoiceNote {
  id: string;
  patientId: string;
  doctorId: string;
  transcription: string;
  createdAt: string;
}

export async function saveVoiceNote(note: Omit<VoiceNote, 'id' | 'createdAt'>) {
  try {
    const { data, error } = await supabase
      .from('voice_notes')
      .insert([{
        patient_id: note.patientId,
        doctor_id: note.doctorId,
        transcription: note.transcription
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Using mock data for voice notes');
    return {
      id: Date.now().toString(),
      ...note,
      created_at: new Date().toISOString()
    };
  }
}

export async function getVoiceNotes(doctorId: string, patientId?: string) {
  try {
    let query = supabase
      .from('voice_notes')
      .select(`
        id,
        transcription,
        created_at,
        patients (
          id,
          first_name,
          last_name
        )
      `)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });

    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Using mock data for voice notes');
    return mockData.voiceNotes;
  }
}