import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Prospekt, { IProspekt } from '@/models/Prospekt';
import { uploadToR2, deleteFromR2 } from '@/lib/r2';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const investment = searchParams.get('investment') || 'zamoyskiego-2';
    const active = searchParams.get('active');

    let query: any = { investment };
    if (active === 'true') {
      query.isActive = true;
    }

    let prospekty = await Prospekt.find(query).sort({ uploadedAt: -1 });

    // Sprawdź faktyczny stan bucketa R2 dla prospektów
    const { listR2Objects } = await import('@/lib/r2');
    const r2Objects = await listR2Objects(`prospekty/${investment}/`);
    
    // Usuń z bazy danych wpisy dla plików, które nie istnieją w buckecie
    const validProspekty = [];
    for (const prospekt of prospekty) {
      const url = new URL(prospekt.fileUrl);
      const key = decodeURIComponent(url.pathname.slice(1));
      
      if (r2Objects.includes(key)) {
        validProspekty.push(prospekt);
      } else {
        // Usuń wpis z bazy, jeśli plik nie istnieje w buckecie
        await Prospekt.findByIdAndDelete(prospekt._id);
        console.log('🗑️ Usunięto wpis z bazy dla nieistniejącego pliku:', key);
      }
    }
    
    prospekty = validProspekty;

    return NextResponse.json({
      success: true,
      prospekty,
    });

  } catch (error) {
    console.error('Błąd podczas pobierania prospektów:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const investment = formData.get('investment') as string || 'zamoyskiego-2';
    const uploadedBy = formData.get('uploadedBy') as string;

    if (!file || !name) {
      return NextResponse.json(
        { error: 'Plik i nazwa są wymagane' },
        { status: 400 }
      );
    }

    // Sprawdź czy plik to PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Dozwolone są tylko pliki PDF' },
        { status: 400 }
      );
    }

    // Konwertuj plik na Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generuj nazwę pliku
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `prospekty/${investment}/${timestamp}_${sanitizedName}`;

    // Upload do R2
    const uploadResult = await uploadToR2(buffer, key, file.type);

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Błąd podczas uploadu' },
        { status: 500 }
      );
    }

    // Dezaktywuj wszystkie poprzednie prospekty dla tej inwestycji
    await Prospekt.updateMany(
      { investment, isActive: true },
      { isActive: false }
    );

    // Utwórz rekord w bazie danych
    const prospekt = new Prospekt({
      name,
      fileName: file.name,
      fileUrl: uploadResult.url,
      fileSize: file.size,
      investment,
      description,
      uploadedBy,
      isActive: true, // Nowy prospekt jest automatycznie aktywny
    });

    await prospekt.save();

    return NextResponse.json({
      success: true,
      prospekt,
    });

  } catch (error) {
    console.error('Błąd podczas uploadu prospektu:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { id, isActive } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID prospektu jest wymagane' },
        { status: 400 }
      );
    }

    // Jeśli aktywujemy prospekt, deaktywuj pozostałe
    if (isActive) {
      const prospekt = await Prospekt.findById(id);
      if (!prospekt) {
        return NextResponse.json(
          { error: 'Prospekt nie znaleziony' },
          { status: 404 }
        );
      }

      // Deaktywuj wszystkie inne prospekty dla tej inwestycji
      await Prospekt.updateMany(
        { investment: prospekt.investment, _id: { $ne: id } },
        { isActive: false }
      );
    }

    // Aktualizuj wybrany prospekt
    const updatedProspekt = await Prospekt.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      prospekt: updatedProspekt,
    });

  } catch (error) {
    console.error('Błąd podczas aktualizacji prospektu:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID prospektu jest wymagane' },
        { status: 400 }
      );
    }

    const prospekt = await Prospekt.findById(id);
    if (!prospekt) {
      return NextResponse.json(
        { error: 'Prospekt nie znaleziony' },
        { status: 404 }
      );
    }

    // Wyodrębnij klucz z URL-a
    const url = new URL(prospekt.fileUrl);
    const key = decodeURIComponent(url.pathname.slice(1)); // Usuń pierwszy slash i zdekoduj URL

    // Usuń z R2
    const deleteResult = await deleteFromR2(key);
    if (!deleteResult) {
      console.warn('Nie udało się usunąć pliku z R2:', key);
    }

    // Usuń z bazy danych
    await Prospekt.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Prospekt został usunięty',
    });

  } catch (error) {
    console.error('Błąd podczas usuwania prospektu:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
