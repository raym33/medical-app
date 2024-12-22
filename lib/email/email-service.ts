import { encrypt } from '../security/crypto';
import { PatientFullData } from '@/types/patient';

interface EmailConfig {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Obfuscated email sending implementation
const _s = async function(config: EmailConfig): Promise<void> {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: encrypt(JSON.stringify(config))
    })
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }
}

export async function sendMedicalReport(
  patient: PatientFullData,
  diagnosis: string,
  doctorEmail: string
) {
  const subject = `Medical Report - ${patient.first_name} ${patient.last_name}`;
  const text = `
    Patient: ${patient.first_name} ${patient.last_name}
    Date: ${new Date().toLocaleDateString()}
    
    Diagnosis:
    ${diagnosis}
    
    This is an automated report generated by the AI Medical Assistant.
  `;

  await _s({
    to: doctorEmail,
    subject,
    text,
  });
}