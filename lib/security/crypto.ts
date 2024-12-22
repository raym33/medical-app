import { AES, enc } from 'crypto-js';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key';

export function encrypt(text: string): string {
  return AES.encrypt(text, ENCRYPTION_KEY).toString();
}

export function decrypt(ciphertext: string): string {
  const bytes = AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(enc.Utf8);
}