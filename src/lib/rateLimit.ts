// Mapa do przechowywania liczby żądań (w produkcji użyj Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Konfiguracja rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuta
const MAX_REQUESTS_PER_WINDOW = 60; // 60 żądań na minutę

export function checkAPIRateLimit(clientIP: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const key = `api_${clientIP}`;
  
  // Pobierz lub utwórz wpis dla IP
  let requestData = requestCounts.get(key);
  
  // Jeśli nie ma wpisu lub okno się zresetowało
  if (!requestData || now > requestData.resetTime) {
    requestData = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    };
    requestCounts.set(key, requestData);
    return { allowed: true };
  }
  
  // Zwiększ licznik
  requestData.count++;
  
  // Sprawdź czy przekroczono limit
  if (requestData.count > MAX_REQUESTS_PER_WINDOW) {
    return { 
      allowed: false, 
      resetTime: requestData.resetTime 
    };
  }
  
  return { allowed: true };
}

// Funkcja do czyszczenia starych wpisów (wywołuj okresowo)
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(key);
    }
  }
}

// Uruchom cleanup co 5 minut
setInterval(cleanupRateLimit, 5 * 60 * 1000);
