import { DiagnosisResult, ReportData, MedicalAnalysisResult } from './types';

export interface AIProviderInterface {
  generateDiagnosis(prompt: string): Promise<string>;
  generateReport(data: ReportData): Promise<string>;
  analyzeMedicalData(data: any): Promise<MedicalAnalysisResult>;
}

export abstract class BaseAIProvider implements AIProviderInterface {
  abstract generateDiagnosis(prompt: string): Promise<string>;
  abstract generateReport(data: ReportData): Promise<string>;
  abstract analyzeMedicalData(data: any): Promise<MedicalAnalysisResult>;

  protected formatDiagnosisPrompt(prompt: string): string {
    return `As a medical AI assistant, please analyze the following patient information and provide a detailed diagnosis:

${prompt}

Please include:
1. Potential diagnosis
2. Confidence level
3. Recommended tests or examinations
4. Treatment suggestions
5. Any warnings or red flags`;
  }

  protected formatReportPrompt(data: ReportData): string {
    return `Please generate a medical report for the following case:

Patient ID: ${data.patientId}
Diagnosis: ${data.diagnosis}
${data.treatment ? `Treatment: ${data.treatment}` : ''}
${data.medications ? `Medications: ${data.medications.join(', ')}` : ''}
${data.followUp ? `Follow-up: ${data.followUp}` : ''}

Please format the report in a professional medical style.`;
  }
}