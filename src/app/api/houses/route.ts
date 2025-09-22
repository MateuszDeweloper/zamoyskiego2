import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import House from '@/models/House';
import PriceHistory from '@/models/PriceHistory';

export async function GET() {
  try {
    await dbConnect();
    
    const houses = await House.find({}).sort({ buildingNumber: 1, unitNumber: 1 });
    
    return NextResponse.json({ houses }, { status: 200 });
  } catch (error) {
    console.error('Error fetching houses:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania danych.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Sprawdź czy mamy dane do zapisania
    if (!body || !Array.isArray(body.houses)) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane wejściowe.' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Zapisz każdy dom i historię cen
    const results = [];
    
    for (const houseData of body.houses) {
      // Oblicz cenę za m² jeśli nie została podana
      if (!houseData.pricePerM2 && houseData.price && houseData.area) {
        houseData.pricePerM2 = Math.round(houseData.price / houseData.area);
      }
      
      // Sprawdź czy dom już istnieje
      const existingHouse = await House.findOne({
        buildingNumber: houseData.buildingNumber,
        unitNumber: houseData.unitNumber
      });
      
      let house;
      
      if (existingHouse) {
        // Jeśli cena się zmieniła, zapisz historię cen
        if (existingHouse.price !== houseData.price) {
          await PriceHistory.create({
            buildingNumber: existingHouse.buildingNumber,
            unitNumber: existingHouse.unitNumber,
            price: existingHouse.price,
            pricePerM2: existingHouse.pricePerM2,
            date: new Date()
          });
        }
        
        // Aktualizuj istniejący dom
        house = await House.findByIdAndUpdate(
          existingHouse._id,
          houseData,
          { new: true }
        );
      } else {
        // Utwórz nowy dom
        house = await House.create(houseData);
        
        // Zapisz pierwszą historię cen
        await PriceHistory.create({
          buildingNumber: house.buildingNumber,
          unitNumber: house.unitNumber,
          price: house.price,
          pricePerM2: house.pricePerM2,
          date: new Date()
        });
      }
      
      results.push(house);
    }
    
    return NextResponse.json({ success: true, houses: results }, { status: 201 });
  } catch (error) {
    console.error('Error saving houses:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas zapisywania danych.' },
      { status: 500 }
    );
  }
}
