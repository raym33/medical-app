import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434';

export interface DocumentGenerationParams {
  patientName: string;
  documentType: 'prescription' | 'referral' | 'medicalReport';
  details: string;
}

export async function generateWithOpenAI({ patientName, documentType, details }: DocumentGenerationParams) {
  const prompt = createPrompt(patientName, documentType, details);
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

export async function generateWithOllama({ patientName, documentType, details }: DocumentGenerationParams) {
  const prompt = createPrompt(patientName, documentType, details);
  
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistral',
      prompt,
    }),
  });

  const data = await response.json();
  return data.response;
}

function createPrompt(patientName: string, documentType: string, details: string): string {
  const prompts = {
    prescription: `Generate a medical prescription for patient ${patientName} with the following details: ${details}. Include medication name, dosage, frequency, and duration.`,
    referral: `Generate a medical referral letter for patient ${patientName} with the following details: ${details}. Include reason for referral, relevant medical history, and current symptoms.`,
    medicalReport: `Generate a medical report for patient ${patientName} with the following details: ${details}. Include diagnosis, treatment plan, and recommendations.`,
  };

  return prompts[documentType as keyof typeof prompts];
}