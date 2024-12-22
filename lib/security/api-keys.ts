import { encrypt, decrypt } from './crypto';
import { _k } from './constants';

export function getOpenAIKey(): string {
  const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!key) {
    // Return a mock key for development
    return 'sk-mock-key-for-development';
  }
  return decrypt(encrypt(key));
}