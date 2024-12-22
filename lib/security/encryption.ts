import { AES, enc } from 'crypto-js';
import { APP_CONFIG } from '@/lib/constants/config';

export class EncryptionService {
  private static instance: EncryptionService;
  private key: string;

  private constructor() {
    this.key = APP_CONFIG.security.encryptionKey;
  }

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  encrypt(data: string): string {
    return AES.encrypt(data, this.key).toString();
  }

  decrypt(ciphertext: string): string {
    const bytes = AES.decrypt(ciphertext, this.key);
    return bytes.toString(enc.Utf8);
  }

  encryptObject<T extends object>(obj: T): string {
    return this.encrypt(JSON.stringify(obj));
  }

  decryptObject<T>(ciphertext: string): T {
    const decrypted = this.decrypt(ciphertext);
    return JSON.parse(decrypted);
  }
}