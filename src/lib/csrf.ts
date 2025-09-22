import crypto from 'crypto';

// Funkcja do hashowania danych (używana m.in. do hashowania IP)
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Funkcja do generowania tokenu CSRF
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Funkcja do weryfikacji tokenu CSRF
export function verifyCSRFToken(token: string, expectedToken: string): boolean {
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken));
}
