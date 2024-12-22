export interface VoiceNote {
  id: string;
  patientId: string;
  doctorId: string;
  transcription: string;
  createdAt: string;
}

export async function saveVoiceNote(note: Omit<VoiceNote, 'id' | 'createdAt'>) {
  // Implement the database save logic here using Supabase
  // This is a placeholder for the actual implementation
  return Promise.resolve({ ...note, id: Date.now().toString(), createdAt: new Date().toISOString() });
}