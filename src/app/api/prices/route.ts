import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import House from '@/models/House';
import PriceHistory from '@/models/PriceHistory';

export async function GET() {
  try {
    await connectDB();
    
    // Pobierz najnowsze daty zmian cen z price-history dla każdego lokalu
    const latestHistory = await PriceHistory.aggregate([
      { $sort: { date: -1 } },
      { $group: {
        _id: { buildingNumber: '$buildingNumber', unitNumber: '$unitNumber' },
        lastChangeDate: { $first: '$date' }
      }}
    ]);
    
    const latestDateByUnit = new Map<string, string>();
    for (const item of latestHistory) {
      const key = `${item._id.buildingNumber}-${item._id.unitNumber}`;
      const d = new Date(item.lastChangeDate);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      latestDateByUnit.set(key, `${y}-${m}-${day}`);
    }
    
    // Pobierz dostępne lokale (available, reserved i sold-not-transferred) z Zamoyskiego 2
    const zamoyskiego2Houses = await House.find({
      status: { $in: ['available', 'reserved', 'sold-not-transferred'] }
    });
    
    // Przygotuj dane dla API zgodnie ze wzorcem ministerstwa
    const properties = [
      // Domy z inwestycji Zamoyskiego 2
      ...zamoyskiego2Houses.map(house => ({
        // Dane dewelopera
        nazwa_dewelopera: "ASCANA",
        forma_prawna_dewelopera: "SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ",
        nr_krs: "0000643374", 
        nr_wpisu_ceidg: "",
        nr_nip: "6762515504", 
        nr_regon: "365693032",
        nr_telefonu: "+48 516 761 261", // Zastąp rzeczywistym numerem
        adres_poczty_elektronicznej: "biuro@ascana.pl",
        nr_faxu: "",
        adres_strony_internetowej_dewelopera: "https://ascana.pl/",
        
    
        wojewodztwo_adresu_siedziby: "podkarpackie",
        powiat_adresu_siedziby: "mielecki",
        gmina_adresu_siedziby: "Mielec",
        miejscowosc_adresu_siedziby: "Mielec",
        ulica_adresu_siedziby: "ul. Wojska Polskiego", 
        nr_nieruchomosci_adresu_siedziby: "3", 
        nr_lokalu_adresu_siedziby: "",
        kod_pocztowy_adresu_siedziby: "39-300",
        
        // Lokal sprzedaży
        wojewodztwo_lokalu_sprzedazy: "podkarpackie",
        powiat_lokalu_sprzedazy: "mielecki",
        gmina_lokalu_sprzedazy: "Mielec",
        miejscowosc_lokalu_sprzedazy: "Mielec",
        ulica_lokalu_sprzedazy: "ul. Wojska Polskiego", 
        nr_nieruchomosci_lokalu_sprzedazy: "3", 
        nr_lokalu_lokalu_sprzedazy: "",
        kod_pocztowy_lokalu_sprzedazy: "39-300",
        dodatkowe_lokalizacje_sprzedazy: "",
        sposob_kontaktu_nabywcy: "Telefon: +48 516 761 261, Email: biuro@ascana.pl",
        
        // Lokalizacja przedsięwzięcia
        wojewodztwo_lokalizacji_przedsiewziecia: "podkarpackie",
        powiat_lokalizacji_przedsiewziecia: "stalowowolski",
        gmina_lokalizacji_przedsiewziecia: "Stalowa Wola",
        miejscowosc_lokalizacji_przedsiewziecia: "Stalowa Wola",
        ulica_lokalizacji_przedsiewziecia: "ul. Jana Zamoyskiego",
        nr_nieruchomosci_lokalizacji_przedsiewziecia: "",
        kod_pocztowy_lokalizacji_przedsiewziecia: "37-450",
        
        // Rodzaj nieruchomości
        rodzaj_nieruchomosci: "dom jednorodzinny",
        nr_lokalu_nadany_przez_dewelopera: `Dom ${house.buildingNumber}${house.unitNumber}`,
        
        // Ceny - data od najnowszej zmiany z price-history (dla danego lokalu)
        cena_m2_powierzchni_uzytkowej: house.status === 'sold-transferred' ? "X" : Math.round(house.price / house.area),
        data_od_ktorej_cena_obowiazuje_m2: (() => {
          if (house.status === 'sold-transferred') return "X";
          const key = `${house.buildingNumber}-${house.unitNumber}`;
          return latestDateByUnit.get(key) || (house.updatedAt ? new Date(house.updatedAt).toISOString().split('T')[0] : (house.createdAt ? new Date(house.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]));
        })(),
        cena_lokalu_bez_pomieszczen_przynaleznych: house.status === 'sold-transferred' ? "X" : house.price,
        data_od_ktorej_cena_obowiazuje_lokalu: (() => {
          if (house.status === 'sold-transferred') return "X";
          const key = `${house.buildingNumber}-${house.unitNumber}`;
          return latestDateByUnit.get(key) || (house.updatedAt ? new Date(house.updatedAt).toISOString().split('T')[0] : (house.createdAt ? new Date(house.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]));
        })(),
        cena_lokalu_z_pomieszczeniami_przynaleznymi: house.status === 'sold-transferred' ? "X" : house.price,
        data_od_ktorej_cena_obowiazuje_lokalu_z_pomieszczeniami: (() => {
          if (house.status === 'sold-transferred') return "X";
          const key = `${house.buildingNumber}-${house.unitNumber}`;
          return latestDateByUnit.get(key) || (house.updatedAt ? new Date(house.updatedAt).toISOString().split('T')[0] : (house.createdAt ? new Date(house.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]));
        })(),
        
        // Części nieruchomości (ogródek tylko dla 1B i 13B)
        rodzaj_czesci_nieruchomosci: (house.floor && house.floor.includes('ogródek')) ? "ogródek" : "X",
        oznaczenie_czesci_nieruchomosci: (house.floor && house.floor.includes('ogródek')) ? `O${house.buildingNumber}${house.unitNumber}` : "X",
        cena_czesci_nieruchomosci: (house.floor && house.floor.includes('ogródek')) ? "0" : "X",
        data_od_ktorej_obowiazuje_cena_czesci: (house.floor && house.floor.includes('ogródek')) ? (() => {
          if (house.status === 'sold-transferred') return "X";
          const key = `${house.buildingNumber}-${house.unitNumber}`;
          return latestDateByUnit.get(key) || (house.updatedAt ? new Date(house.updatedAt).toISOString().split('T')[0] : (house.createdAt ? new Date(house.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]));
        })() : "X",
        
        // Pomieszczenia przynależne
        rodzaj_pomieszczen_przynaleznych: "brak",
        oznaczenie_pomieszczen_przynaleznych: "X",
        cena_pomieszczen_przynaleznych: "X",
        data_od_ktorej_obowiazuje_cena_pomieszczen: "X",
        
        // Prawa niezbędne
        wyszczegolnienie_praw_niezbednych: "X",
        wartosc_praw_niezbednych: "X",
        data_od_ktorej_obowiazuje_cena_praw: "X",
        
        // Inne świadczenia
        wyszczegolnienie_innych_swiadczen: "X",
        wartosc_innych_swiadczen: "X",
        data_od_ktorej_obowiazuje_cena_swiadczen: "X",
        
        // Prospekt informacyjny
        adres_strony_prospektu: "https://zamoyskiego2.ascana.pl/",
        
        // Dodatkowe informacje dla naszego API
        investment: "zamoyskiego-2",
        building_number: house.buildingNumber,
        unit_number: house.unitNumber,
        area_m2: house.area,
        total_price_pln: house.status === 'sold-transferred' ? "X" : house.price,
        total_price_pln_m2: house.status === 'sold-transferred' ? "X" : Math.round(house.price / house.area),
        floor: house.floor,
        garden: (house.floor && house.floor.includes('ogródek')),
        status: house.status || 'available'
      }))
    ];

    // Uproszczona struktura dla lepszej kompatybilności z dane.gov.pl
    const response = {
      // Metadane DCAT
      "@context": "https://schema.org",
      "@type": "Dataset",
      "name": "Ceny ofertowe mieszkań dewelopera ASCANA",
      "description": "Ceny ofertowe mieszkań dewelopera ASCANA, automatycznie aktualizowane zgodnie z art. 19b ust. 1 ustawy z dnia 20 maja 2021 r. o ochronie praw nabywcy lokalu mieszkalnego lub domu jednorodzinnego oraz Funduszu Gwarancyjnym Deweloperskim",
      "provider": "ASCANA",
      "dateModified": new Date().toISOString(),
      "datePublished": new Date().toISOString().split('T')[0],
      "totalProperties": properties.length,
      "license": "https://dane.gov.pl/",
      "keywords": ["nieruchomości", "ceny", "deweloper", "domy", "mieszkania", "Stalowa Wola"],
      "spatialCoverage": "Stalowa Wola, Podkarpackie",
      "temporalCoverage": `${new Date().toISOString().split('T')[0]}/`,
      
      // Dane zgodne ze wzorcem ministerstwa
      "properties": properties
    };

    // Dodaj nagłówki dla lepszej kompatybilności z dane.gov.pl
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-cache, must-revalidate',
      'Pragma': 'no-cache'
    };

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('Błąd podczas pobierania cen:', error);
    return NextResponse.json(
      { error: 'Błąd podczas pobierania cen' },
      { status: 500 }
    );
  }
}
