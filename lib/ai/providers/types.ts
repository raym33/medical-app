export interface DiagnosisResult {
  diagnosis: string;
  confidence: number;
  recommendations?: string[];
  warnings?: string[];
}

export interface ReportData {
  patientId: string;
  diagnosis: string;
  treatment?: string;
  medications?: string[];
  followUp?: string;
}

export interface MedicalAnalysisResult {
  findings: string[];
  risks: string[];
  recommendations: string[];
  confidence: number;
}