import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PriceHistory from '@/models/PriceHistory';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const buildingNumber = searchParams.get('buildingNumber');
    const unitNumber = searchParams.get('unitNumber');
    
    await dbConnect();
    
    let query = {};
    
    // Jeśli podano parametry, filtruj po nich
    if (buildingNumber && unitNumber) {
      // Konwertuj buildingNumber na liczbę jeśli to możliwe
      const parsedBuildingNumber = isNaN(Number(buildingNumber)) ? buildingNumber : Number(buildingNumber);
      query = { buildingNumber: parsedBuildingNumber, unitNumber };
    } else if (buildingNumber) {
      const parsedBuildingNumber = isNaN(Number(buildingNumber)) ? buildingNumber : Number(buildingNumber);
      query = { buildingNumber: parsedBuildingNumber };
    }
    
    const priceHistory = await PriceHistory.find(query)
      .sort({ date: 1 })
      .lean();
    
    return NextResponse.json({ priceHistory }, { status: 200 });
  } catch (error) {
    console.error('Error fetching price history:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania historii cen.' },
      { status: 500 }
    );
  }
}
