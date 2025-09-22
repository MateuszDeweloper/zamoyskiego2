import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const revalidate = 0;

export async function POST() {
  try {
    // Usuń ciasteczko z tokenem autoryzacyjnym
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    
    // Zwróć odpowiedź z sukcesem
    return NextResponse.json(
      { success: true, message: 'Wylogowano pomyślnie' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Błąd wylogowania:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wylogowania' },
      { status: 500 }
    );
  }
}
