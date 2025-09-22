import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    await connectDB();

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await User.findOne({ username: 'admin_zamoyskiego2' });
    
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'Użytkownik admin_zamoyskiego2 już istnieje!',
        credentials: {
          username: 'admin_zamoyskiego2',
          password: 'ASCANA2024!Zamoyskiego'
        }
      });
    }

    // Wygeneruj hasło
    const password = 'ASCANA2024!Zamoyskiego';
    const { hashedPassword, salt } = await hashPassword(password);

    // Utwórz nowego użytkownika
    const adminUser = new User({
      username: 'admin_zamoyskiego2',
      hashedPassword,
      salt,
      role: 'admin',
      isActive: true,
      email: 'admin@ascana.pl',
      createdAt: new Date(),
      lastLogin: null
    });

    await adminUser.save();

    return NextResponse.json({
      success: true,
      message: 'Użytkownik administratora został utworzony pomyślnie!',
      credentials: {
        username: 'admin_zamoyskiego2',
        password: 'ASCANA2024!Zamoyskiego'
      },
      urls: {
        login: '/b3e7a9c2-4f8d-1e6b-9a5c-7d2f8e1b4c6a-login',
        admin: '/78d9f2a1-6b5c-4e8a-9d3f-1c7b2e4f6a8d-admin',
        pricesJSON: '/api/prices',
        pricesCSV: '/api/prices/csv'
      }
    });

  } catch (error) {
    console.error('Błąd podczas tworzenia użytkownika:', error);
    return NextResponse.json(
      { error: 'Błąd podczas tworzenia użytkownika administratora' },
      { status: 500 }
    );
  }
}
