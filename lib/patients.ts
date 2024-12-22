import { supabase } from '@/lib/db/supabase';
import { Patient, PatientFullData } from '@/types/patient';
import { mockData } from '@/lib/db/mock-data';

export async function getPatients(): Promise<Patient[]> {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || mockData.patients;
  } catch (error) {
    console.warn('Using mock data for patients:', error);
    return mockData.patients;
  }
}

export async function getPatientFullData(patientId: string): Promise<PatientFullData> {
  try {
    const [patientData, voiceNotes, medications] = await Promise.all([
      supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single(),
      supabase
        .from('voice_notes')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false }),
      supabase
        .from('medications')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
    ]);

    if (patientData.error) throw patientData.error;

    return {
      ...patientData.data,
      voiceNotes: voiceNotes.data || [],
      medications: medications.data || []
    };
  } catch (error) {
    console.warn('Using mock data for patient details:', error);
    const mockPatient = mockData.patients.find(p => p.id === patientId);
    if (!mockPatient) throw new Error('Patient not found');
    
    return {
      ...mockPatient,
      voiceNotes: mockData.voiceNotes.filter(n => n.patients.id === patientId),
      medications: []
    };
  }
}