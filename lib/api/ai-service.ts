import { PatientFullData } from '@/types/patient';
import { generateAIDiagnosis } from '../ai-assistant';

export async function generateDiagnosis(data: {
  patientId: string;
  model: "openai" | "ollama";
  patientData: PatientFullData;
  additionalNotes?: string;
}) {
  try {
    return await generateAIDiagnosis({
      patientData: data.patientData,
      model: data.model,
      additionalNotes: data.additionalNotes
    });
  } catch (error) {
    throw new Error("Failed to generate diagnosis");
  }
}