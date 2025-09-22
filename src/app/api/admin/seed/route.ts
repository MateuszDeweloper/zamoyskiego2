import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import House from '@/models/House';

// Endpoint do sprawdzenia stanu bazy danych
export async function POST() {
  try {
    await dbConnect();
    
    // Sprawdź czy baza danych zawiera dane
    const housesCount = await House.countDocuments();
    
    return NextResponse.json(
      { 
        success: true, 
        message: `Baza danych zawiera ${housesCount} domów.`,
        housesCount 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking database:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas sprawdzania bazy danych.' },
      { status: 500 }
    );
  }
}
