import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import House from '@/models/House';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Sprawdź czy mamy dane do zapisania
    if (!body || !Array.isArray(body.polygons)) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane wejściowe.' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Zapisz współrzędne dla każdego domu
    const results = [];
    
    for (const polygonData of body.polygons) {
      if (!polygonData.buildingNumber || !polygonData.unitNumber || !polygonData.vertices) {
        console.warn('Pominięto polygon z niepełnymi danymi:', polygonData);
        continue;
      }
      
      // Znajdź dom w bazie danych
      const house = await House.findOne({
        buildingNumber: polygonData.buildingNumber,
        unitNumber: polygonData.unitNumber
      });
      
      if (house) {
        // Aktualizuj współrzędne
        house.vertices = polygonData.vertices;
        await house.save();
        results.push(house);
        console.log(`Zaktualizowano współrzędne dla ${polygonData.buildingNumber}${polygonData.unitNumber}`);
      } else {
        console.warn(`Nie znaleziono domu ${polygonData.buildingNumber}${polygonData.unitNumber} w bazie danych`);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Zaktualizowano współrzędne dla ${results.length} domów`,
      updatedHouses: results.length 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error saving polygons:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas zapisywania współrzędnych.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    // Pobierz wszystkie domy z współrzędnymi
    const houses = await House.find({}).select('buildingNumber unitNumber vertices').sort({ buildingNumber: 1, unitNumber: 1 });
    
    // Przekształć dane do formatu wymaganego przez frontend
    const polygons = houses.map(house => ({
      buildingNumber: house.buildingNumber,
      unitNumber: house.unitNumber,
      vertices: house.vertices || []
    }));
    
    return NextResponse.json({ polygons }, { status: 200 });
  } catch (error) {
    console.error('Error fetching polygons:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania współrzędnych.' },
      { status: 500 }
    );
  }
}
