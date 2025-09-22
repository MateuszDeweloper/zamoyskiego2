export const revalidate = 0;
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { checkAPIRateLimit } from '@/lib/rateLimit';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = checkAPIRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Zbyt wiele żądań. Spróbuj ponownie później.' }),
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // Pobranie tokenu z ciasteczek
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: 'Brak autoryzacji' }),
        { status: 401 }
      );
    }

    // Weryfikacja tokenu
    try {
      const secret = process.env.JWT_SECRET || 'default_secret';
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
      
      // Sprawdź czy token nie wygasł
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return new NextResponse(
          JSON.stringify({ message: 'Token wygasł' }),
          { status: 401 }
        );
      }
      
      // Token jest poprawny
      return new NextResponse(
        JSON.stringify({ 
          message: 'Autoryzacja poprawna',
          user: {
            id: payload.id,
            username: payload.username,
            role: payload.role
          }
        }),
        { status: 200 }
      );
    } catch (error) {
      // Token jest nieprawidłowy lub wygasł
      return new NextResponse(
        JSON.stringify({ message: 'Token wygasł lub jest nieprawidłowy' }),
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Błąd sprawdzania autoryzacji:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Wystąpił błąd podczas weryfikacji tokenu' }),
      { status: 500 }
    );
  }
}
