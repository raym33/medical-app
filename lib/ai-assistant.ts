import { getOpenAIKey } from './security/api-keys';
import { PatientFullData } from '@/types/patient';
import { createObfuscatedOpenAI } from './security/openai-wrapper';

// Initialize OpenAI client with error handling
let openai;
try {
  openai = createObfuscatedOpenAI(getOpenAIKey());
} catch (error) {
  console.warn('Failed to initialize OpenAI client:', error);
}

const OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434';

interface GenerateAIDiagnosisParams {
  patientData: PatientFullData;
  model: 'openai' | 'ollama';
  additionalNotes?: string;
}

export async function generateAIDiagnosis({ 
  patientData, 
  model, 
  additionalNotes 
}: GenerateAIDiagnosisParams): Promise<string> {
  try {
    const prompt = createPrompt(patientData, additionalNotes);
    return model === 'openai' 
      ? await generateWithOpenAI(prompt)
      : await generateWithOllama(prompt);
  } catch (error) {
    console.error('AI generation error:', error);
    return 'Failed to generate diagnosis. Please try again later.';
  }
}

async function generateWithOpenAI(prompt: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an AI medical assistant."
      },
      { role: "user", content: prompt }
    ],
  });

  return response.choices[0].message.content || '';
}

async function generateWithOllama(prompt: string): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral',
      prompt,
    }),
  });

  if (!response.ok) {
    throw new Error('Ollama API request failed');
  }

  const data = await response.json();
  return data.response;
}

function createPrompt(data: PatientFullData, notes?: string): string {
  const { first_name, last_name, date_of_birth, gender, medical_history, voiceNotes, medications } = data;
  
  return [
    `Patient: ${first_name} ${last_name}`,
    `DOB: ${date_of_birth}`,
    `Gender: ${gender}`,
    `History: ${medical_history || 'None'}`,
    `Recent Notes: ${voiceNotes?.map(n => n.transcription).join('\n') || 'None'}`,
    `Current Medications: ${medications?.map(m => `${m.name} (${m.dosage})`).join(', ') || 'None'}`,
    `Additional Notes: ${notes || 'None'}`
  ].join('\n');
}