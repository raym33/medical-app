import { aiProviders, AIProvider } from './providers';
import { PatientFullData } from '@/types/patient';

export class DiagnosisService {
  private static instance: DiagnosisService;

  private constructor() {}

  static getInstance(): DiagnosisService {
    if (!DiagnosisService.instance) {
      DiagnosisService.instance = new DiagnosisService();
    }
    return DiagnosisService.instance;
  }

  async generateDiagnosis(
    patientData: PatientFullData,
    provider: AIProvider,
    additionalNotes?: string
  ): Promise<string> {
    const prompt = this.createPrompt(patientData, additionalNotes);
    return await aiProviders[provider].generateDiagnosis(prompt);
  }

  private createPrompt(data: PatientFullData, notes?: string): string {
    return `
Patient Information:
- Name: ${data.first_name} ${data.last_name}
- DOB: ${data.date_of_birth}
- Gender: ${data.gender}

Medical History:
${data.medical_history || 'None recorded'}

Recent Notes:
${data.voiceNotes?.map(n => `- ${n.transcription}`).join('\n') || 'None'}

Current Medications:
${data.medications?.map(m => `- ${m.name} (${m.dosage})`).join('\n') || 'None'}

Additional Notes:
${notes || 'None'}

Please provide a comprehensive medical analysis and potential diagnosis based on the above information.
    `.trim();
  }
}