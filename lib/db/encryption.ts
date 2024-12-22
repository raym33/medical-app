import { encrypt, decrypt } from '../security/crypto';

export interface EncryptedData {
  id: string;
  patient_id: string;
  data_type: string;
  encrypted_data: string;
  created_at: string;
  updated_at: string;
}

export async function encryptAndSavePatientData(
  patientId: string,
  dataType: string,
  data: any
): Promise<EncryptedData> {
  const encryptedData = encrypt(JSON.stringify(data));
  
  const { data: result, error } = await supabase
    .from('encrypted_patient_data')
    .insert([{
      patient_id: patientId,
      data_type: dataType,
      encrypted_data: encryptedData
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getDecryptedPatientData(
  patientId: string,
  dataType: string
): Promise<any> {
  const { data, error } = await supabase
    .from('encrypted_patient_data')
    .select('*')
    .eq('patient_id', patientId)
    .eq('data_type', dataType)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  if (!data) return null;

  const decryptedData = decrypt(data.encrypted_data);
  return JSON.parse(decryptedData);
}