import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2 } from '@/lib/r2';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: 'Nie wybrano pliku' },
        { status: 400 }
      );
    }

    // Konwertuj plik na Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generuj unikalną nazwę pliku
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${folder}/${timestamp}_${sanitizedName}`;

    // Upload do R2
    const result = await uploadToR2(buffer, key, file.type);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Błąd podczas uploadu' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      filename: file.name,
    });

  } catch (error) {
    console.error('Błąd API upload:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
