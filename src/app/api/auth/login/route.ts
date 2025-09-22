export const revalidate = 0;
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyPassword, generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { hashData } from '@/lib/csrf';

// Map do przechowywania prób logowania (w produkcji użyj Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number; blockedUntil?: number }>();

// Konfiguracja zabezpieczeń
const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minut
const RESET_AFTER = 60 * 60 * 1000; // 1 godzina

// Funkcja do rejestrowania nieudanych prób logowania
function recordFailedAttempt(hashedIP: string) {
  const now = Date.now();
  const attempts = loginAttempts.get(hashedIP) || { count: 0, lastAttempt: 0 };
  
  attempts.count++;
  attempts.lastAttempt = now;
  
  // Jeśli przekroczono limit prób, zablokuj IP
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    attempts.blockedUntil = now + BLOCK_DURATION;
  }
  
  loginAttempts.set(hashedIP, attempts);
}

export async function POST(request: Request) {
  try {
    // Pobierz IP użytkownika
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const userIP = forwarded?.split(',')[0] || realIP || 'unknown';
    const hashedIP = hashData(userIP);

    // Sprawdź czy IP nie jest zablokowane
    const attempts = loginAttempts.get(hashedIP);
    const now = Date.now();

    if (attempts) {
      // Sprawdź czy IP jest zablokowane
      if (attempts.blockedUntil && now < attempts.blockedUntil) {
        const remainingTime = Math.ceil((attempts.blockedUntil - now) / 1000 / 60);
        return NextResponse.json(
          { error: `Zbyt wiele nieudanych prób logowania. Spróbuj ponownie za ${remainingTime} minut.` },
          { status: 429 }
        );
      }

      // Resetuj licznik jeśli minęło wystarczająco czasu
      if (now - attempts.lastAttempt > RESET_AFTER) {
        loginAttempts.delete(hashedIP);
      }
    }

    // Połącz z bazą danych jeśli nie jest połączona
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    // Pobierz dane logowania z ciała żądania
    const { username, password, rememberMe } = await request.json();

    // Sprawdź czy podano wszystkie wymagane dane
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane logowania' },
        { status: 400 }
      );
    }

    // Znajdź użytkownika w bazie danych - pobierz pełny obiekt bez .lean() aby mieć dostęp do wszystkich metod
    const user = await User.findOne({ username });

    // Jeśli użytkownik nie istnieje
    if (!user) {
      recordFailedAttempt(hashedIP);
      return NextResponse.json(
        { error: 'Nieprawidłowe dane logowania' },
        { status: 401 }
      );
    }

    // Sprawdź czy użytkownik jest aktywny
    if (!user.isActive) {
      recordFailedAttempt(hashedIP);
      return NextResponse.json(
        { error: 'Konto jest nieaktywne' },
        { status: 401 }
      );
    }

    // Weryfikuj hasło - hasło jest pobierane z bazy danych (user.hashedPassword i user.salt)
    const isPasswordValid = await verifyPassword(user, password);
    
    if (!isPasswordValid) {
      recordFailedAttempt(hashedIP);
      return NextResponse.json(
        { error: 'Nieprawidłowe dane logowania' },
        { status: 401 }
      );
    }

    // Sukces - wyczyść licznik prób
    loginAttempts.delete(hashedIP);

    // Wygeneruj token JWT
    const token = await generateToken(user);

    // Ustaw cookie z tokenem - jeśli wybrano "Zapamiętaj mnie", ustaw dłuższy czas trwania
    const maxAge = rememberMe 
      ? 60 * 60 * 24 * 30  // 30 dni (jeśli zapamiętaj mnie jest włączone)
      : 60 * 60 * 12;      // 12 godzin (domyślnie)

    // Poprawne ustawienie ciasteczka
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: maxAge,
      path: '/'
    });

    // Zwróć odpowiedź z sukcesem
    return NextResponse.json(
      { 
        success: true, 
        message: 'Zalogowano pomyślnie',
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        },
        sessionDuration: rememberMe ? '30 dni' : '12 godzin'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Błąd logowania:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas logowania' },
      { status: 500 }
    );
  }
}
