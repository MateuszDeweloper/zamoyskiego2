// @ts-nocheck
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import House from '@/models/House';
import PriceHistory from '@/models/PriceHistory';
import mongoose from 'mongoose';

// GET - Pobierz konkretny lokal
export async function GET(req, context) {
  try {
    await connectDB();
    
    const id = context.params.id;
    
    // Sprawdź czy ID jest prawidłowe
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Nieprawidłowe ID lokalu' },
        { status: 400 }
      );
    }

    const house = await House.findById(id);
    
    if (!house) {
      return NextResponse.json(
        { error: 'Nie znaleziono lokalu' },
        { status: 404 }
      );
    }

    return NextResponse.json({ house });
  } catch (error) {
    console.error('Błąd podczas pobierania lokalu:', error);
    return NextResponse.json(
      { error: 'Błąd podczas pobierania danych lokalu' },
      { status: 500 }
    );
  }
}

// PUT - Aktualizuj lokal
export async function PUT(req, context) {
  try {
    await connectDB();
    
    const id = context.params.id;
    
    // Sprawdź czy ID jest prawidłowe
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Nieprawidłowe ID lokalu' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      buildingNumber,
      unitNumber,
      area,
      price,
      pricePerM2,
      status,
      floor,
      auxiliaryRooms,
      isAvailable
    } = body;

    // Walidacja danych
    if (!buildingNumber || !unitNumber || !area || !price || !status) {
      return NextResponse.json(
        { error: 'Brakuje wymaganych danych' },
        { status: 400 }
      );
    }

    // Pobierz obecny lokal aby sprawdzić czy cena się zmieniła
    const currentHouse = await House.findById(id);
    if (!currentHouse) {
      return NextResponse.json(
        { error: 'Nie znaleziono lokalu' },
        { status: 404 }
      );
    }

    // Aktualizuj lokal
    const updatedHouse = await House.findByIdAndUpdate(
      id,
      {
        buildingNumber,
        unitNumber,
        area: Number(area),
        price: Number(price),
        pricePerM2: Number(pricePerM2),
        status,
        floor: String(floor),
        auxiliaryRooms: auxiliaryRooms || '',
        isAvailable: Boolean(isAvailable),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedHouse) {
      return NextResponse.json(
        { error: 'Nie udało się zaktualizować lokalu' },
        { status: 400 }
      );
    }

    // Sprawdź czy istnieje historia cen dla tego lokalu
    const existingPriceHistory = await PriceHistory.findOne({
      buildingNumber,
      unitNumber
    });

    // Jeśli nie ma historii cen, dodaj initial price point
    if (!existingPriceHistory) {
      const initialPriceHistoryEntry = new PriceHistory({
        buildingNumber,
        unitNumber,
        price: Number(price),
        pricePerM2: Number(pricePerM2),
        date: new Date()
      });
      
      await initialPriceHistoryEntry.save();
    } else if (currentHouse.price !== Number(price)) {
      // Jeśli cena się zmieniła, dodaj nowy wpis do historii cen
      const priceHistoryEntry = new PriceHistory({
        buildingNumber,
        unitNumber,
        price: Number(price),
        pricePerM2: Number(pricePerM2),
        date: new Date()
      });
      
      await priceHistoryEntry.save();
    }

    return NextResponse.json({ 
      house: updatedHouse,
      message: 'Lokal został zaktualizowany pomyślnie'
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji lokalu:', error);
    return NextResponse.json(
      { error: 'Błąd podczas aktualizacji lokalu' },
      { status: 500 }
    );
  }
}

// DELETE - Usuń lokal (opcjonalnie)
export async function DELETE(req, context) {
  try {
    await connectDB();
    
    const id = context.params.id;
    
    // Sprawdź czy ID jest prawidłowe
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Nieprawidłowe ID lokalu' },
        { status: 400 }
      );
    }

    const house = await House.findById(id);
    if (!house) {
      return NextResponse.json(
        { error: 'Nie znaleziono lokalu' },
        { status: 404 }
      );
    }

    await House.findByIdAndDelete(id);

    // Usuń również historię cen dla tego lokalu
    await PriceHistory.deleteMany({
      buildingNumber: house.buildingNumber,
      unitNumber: house.unitNumber
    });

    return NextResponse.json({ 
      message: 'Lokal został usunięty pomyślnie'
    });
  } catch (error) {
    console.error('Błąd podczas usuwania lokalu:', error);
    return NextResponse.json(
      { error: 'Błąd podczas usuwania lokalu' },
      { status: 500 }
    );
  }
}