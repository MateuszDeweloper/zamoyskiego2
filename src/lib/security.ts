import { NextRequest } from 'next/server';

// Funkcja do walidacji i sanityzacji danych wejściowych
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>'"]/g, '') // Usuń potencjalnie niebezpieczne znaki
    .slice(0, 1000); // Ogranicz długość
}

// Funkcja do sprawdzania czy żądanie pochodzi z dozwolonego źródła
export function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'http://localhost:3000',
    'https://zamoyskiego2.ascana.pl',
    'https://ascana.pl'
  ];
  
  return !origin || allowedOrigins.includes(origin);
}

// Funkcja do walidacji User-Agent (blokuje niektóre boty)
export function isValidUserAgent(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Lista podejrzanych User-Agent'ów
  const blockedAgents = [
    'curl',
    'wget',
    'python-requests',
    'bot',
    'spider',
    'crawler'
  ];
  
  const lowerUA = userAgent.toLowerCase();
  return !blockedAgents.some(blocked => lowerUA.includes(blocked));
}

// Funkcja do sprawdzania czy IP nie jest na czarnej liście
export function isBlockedIP(ip: string): boolean {
  // Lista zablokowanych IP (w produkcji przechowuj w bazie danych)
  const blockedIPs: string[] = [
    // Dodaj tutaj IP które chcesz zablokować
  ];
  
  return blockedIPs.includes(ip);
}
