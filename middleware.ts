import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Ścieżki wymagające autoryzacji
const protectedPaths = [
  '/78d9f2a1-6b5c-4e8a-9d3f-1c7b2e4f6a8d-admin'
];

// Ścieżki publiczne (logowanie)
const publicPaths = [
  '/b3e7a9c2-4f8d-1e6b-9a5c-7d2f8e1b4c6a-login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/admin/create-user'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sprawdź czy ścieżka wymaga autoryzacji
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Jeśli to nie chroniona ścieżka, kontynuuj
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Pobierz token z ciasteczek
  const token = request.cookies.get('auth_token')?.value;

  // Jeśli brak tokenu, przekieruj do logowania
  if (!token) {
    const loginUrl = new URL('/b3e7a9c2-4f8d-1e6b-9a5c-7d2f8e1b4c6a-login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Weryfikuj token
  try {
    const secret = process.env.JWT_SECRET || 'default_secret';
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    
    // Sprawdź czy token nie wygasł
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      const loginUrl = new URL('/b3e7a9c2-4f8d-1e6b-9a5c-7d2f8e1b4c6a-login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Sprawdź czy użytkownik ma rolę admin
    if (payload.role !== 'admin') {
      const loginUrl = new URL('/b3e7a9c2-4f8d-1e6b-9a5c-7d2f8e1b4c6a-login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Token jest poprawny - kontynuuj
    return NextResponse.next();
  } catch (error) {
    // Token jest nieprawidłowy - przekieruj do logowania
    const loginUrl = new URL('/b3e7a9c2-4f8d-1e6b-9a5c-7d2f8e1b4c6a-login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Konfiguracja matcher - określa dla jakich ścieżek middleware ma się uruchomić
export const config = {
  matcher: [
    // Chronione ścieżki administracyjne
    '/78d9f2a1-6b5c-4e8a-9d3f-1c7b2e4f6a8d-admin/:path*',
    // Ścieżki logowania (dla potencjalnych przekierowań)
    '/b3e7a9c2-4f8d-1e6b-9a5c-7d2f8e1b4c6a-login'
  ]
};
