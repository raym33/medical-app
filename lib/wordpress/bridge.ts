import { WordPressAPIClient } from './api-client';
import { EncryptionService } from '@/lib/security/encryption';

declare global {
  interface Window {
    medicalAppConfig: {
      apiUrl: string;
      nonce: string;
    };
  }
}

export class WordPressBridge {
  private static instance: WordPressBridge;
  private api: WordPressAPIClient;
  private encryption: EncryptionService;

  private constructor() {
    const config = window.medicalAppConfig;
    this.api = new WordPressAPIClient(config.apiUrl, config.nonce);
    this.encryption = EncryptionService.getInstance();
  }

  static getInstance(): WordPressBridge {
    if (!WordPressBridge.instance) {
      WordPressBridge.instance = new WordPressBridge();
    }
    return WordPressBridge.instance;
  }

  async syncPatientData(patientData: any): Promise<void> {
    const encryptedData = this.encryption.encryptObject(patientData);
    await this.api.request('/sync', {
      method: 'POST',
      body: JSON.stringify({ data: encryptedData }),
    });
  }

  async getWordPressPatients(): Promise<any[]> {
    const patients = await this.api.getPatients();
    return patients.map(patient => ({
      ...patient,
      data: this.encryption.decryptObject(patient.encryptedData),
    }));
  }
}