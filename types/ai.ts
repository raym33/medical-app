export interface AIModel {
  id: "openai" | "ollama";
  name: string;
  description: string;
}

export interface DiagnosisRequest {
  patientId: string;
  model: AIModel["id"];
  additionalNotes?: string;
}

export interface DiagnosisResponse {
  diagnosis: string;
  confidence: number;
  recommendations: string[];
  warnings?: string[];
}