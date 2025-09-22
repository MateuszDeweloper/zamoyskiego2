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
    
    // Pobierz tylko dostępne lokale (available, reserved i sold-not-transferred) z Zamoyskiego 2
    const zamoyskiego2Houses = await House.find({
      status: { $in: ['available', 'reserved', 'sold-not-transferred'] }
    });

    // Przygotuj dane dla CSV zgodnie ze wzorcem ministerstwa
    const csvData = zamoyskiego2Houses.map(house => {
      const getDate = () => {
        const key = `${house.buildingNumber}-${house.unitNumber}`;
        return latestDateByUnit.get(key) || (house.updatedAt ? new Date(house.updatedAt).toISOString().split('T')[0] : (house.createdAt ? new Date(house.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]));
      };

      return [
        "ASCANA", // Nazwa dewelopera
        "SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ", // Forma prawna dewelopera
        "0000643374", // Nr KRS
        "", // Nr wpisu do CEiDG
        "6762515504", // Nr NIP
        "365693032", // Nr REGON
        "+48 516 761 261", // Nr telefonu
        "biuro@ascana.pl", // Adres poczty elektronicznej
        "", // Nr faxu
        "https://ascana.pl/", // Adres strony internetowej dewelopera
        "podkarpackie", // Województwo adresu siedziby
        "mielecki", // Powiat adresu siedziby
        "Mielec", // Gmina adresu siedziby
        "Mielec", // Miejscowość adresu siedziby
        "ul. Wojska Polskiego", // Ulica adresu siedziby
        "3", // Nr nieruchomości adresu siedziby
        "", // Nr lokalu adresu siedziby
        "39-300", // Kod pocztowy adresu siedziby
        "podkarpackie", // Województwo adresu lokalu sprzedaży
        "mielecki", // Powiat adresu lokalu sprzedaży
        "Mielec", // Gmina adresu lokalu sprzedaży
        "Mielec", // Miejscowość adresu lokalu sprzedaży
        "ul. Wojska Polskiego", // Ulica adresu lokalu sprzedaży
        "3", // Nr nieruchomości adresu lokalu sprzedaży
        "", // Nr lokalu adresu lokalu sprzedaży
        "39-300", // Kod pocztowy adresu lokalu sprzedaży
        "", // Dodatkowe lokalizacje sprzedaży
        "Telefon: +48 516 761 261, Email: biuro@ascana.pl", // Sposób kontaktu nabywcy
        "podkarpackie", // Województwo lokalizacji przedsięwzięcia
        "stalowowolski", // Powiat lokalizacji przedsięwzięcia
        "Stalowa Wola", // Gmina lokalizacji przedsięwzięcia
        "Stalowa Wola", // Miejscowość lokalizacji przedsięwzięcia
        "ul. Jana Zamoyskiego", // Ulica lokalizacji przedsięwzięcia
        "", // Nr nieruchomości lokalizacji przedsięwzięcia
        "37-450", // Kod pocztowy lokalizacji przedsięwzięcia
        "dom jednorodzinny", // Rodzaj nieruchomości
        `Dom ${house.buildingNumber}${house.unitNumber}`, // Nr lokalu nadany przez dewelopera
        house.status === 'sold-transferred' ? "X" : Math.round(house.price / house.area), // Cena m2 powierzchni użytkowej
        house.status === 'sold-transferred' ? "X" : getDate(), // Data od której cena obowiązuje m2
        house.status === 'sold-transferred' ? "X" : house.price, // Cena lokalu bez pomieszczeń przynależnych
        house.status === 'sold-transferred' ? "X" : getDate(), // Data od której cena obowiązuje lokalu
        house.status === 'sold-transferred' ? "X" : house.price, // Cena lokalu z pomieszczeniami przynaleznymi
        house.status === 'sold-transferred' ? "X" : getDate(), // Data od której obowiązuje cena lokalu z pomieszczeniami
        (house.floor && house.floor.includes('ogródek')) ? "ogródek" : "X", // Rodzaj części nieruchomości
        (house.floor && house.floor.includes('ogródek')) ? `O${house.buildingNumber}${house.unitNumber}` : "X", // Oznaczenie części nieruchomości
        (house.floor && house.floor.includes('ogródek')) ? "0" : "X", // Cena części nieruchomości
        (house.floor && house.floor.includes('ogródek')) ? (house.status === 'sold-transferred' ? "X" : getDate()) : "X", // Data od której obowiązuje cena części
        "brak", // Rodzaj pomieszczeń przynależnych
        "X", // Oznaczenie pomieszczeń przynależnych
        "X", // Cena pomieszczeń przynależnych
        "X", // Data od której obowiązuje cena pomieszczeń
        "X", // Wyszczególnienie praw niezbędnych
        "X", // Wartość praw niezbędnych
        "X", // Data od której obowiązuje cena praw
        "X", // Wyszczególnienie innych świadczeń
        "X", // Wartość innych świadczeń
        "X", // Data od której obowiązuje cena świadczeń
        "https://zamoyskiego2.ascana.pl/" // Adres strony prospektu
      ];
    });

    // Nagłówki CSV
    const headers = [
      "Nazwa dewelopera",
      "Forma prawna dewelopera",
      "Nr KRS",
      "Nr wpisu do CEiDG",
      "Nr NIP",
      "Nr REGON",
      "Nr telefonu",
      "Adres poczty elektronicznej",
      "Nr faxu",
      "Adres strony internetowej dewelopera",
      "Województwo adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
      "Powiat adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
      "Gmina adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
      "Miejscowość adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
      "Ulica adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
      "Nr nieruchomości adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
      "Nr lokalu adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
      "Kod pocztowy adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
      "Województwo adresu lokalu, w którym prowadzona jest sprzedaż",
      "Powiat adresu lokalu, w którym prowadzona jest sprzedaż",
      "Gmina adresu lokalu, w którym prowadzona jest sprzedaż",
      "Miejscowość adresu lokalu, w którym prowadzona jest sprzedaż",
      "Ulica adresu lokalu, w którym prowadzona jest sprzedaż",
      "Nr nieruchomości adresu lokalu, w którym prowadzona jest sprzedaż",
      "Nr lokalu adresu lokalu, w którym prowadzona jest sprzedaż",
      "Kod pocztowy adresu lokalu, w którym prowadzona jest sprzedaż",
      "Dodatkowe lokalizacje, w których prowadzona jest sprzedaż",
      "Sposób kontaktu nabywcy z deweloperem",
      "Województwo lokalizacji przedsięwzięcia deweloperskiego lub zadania inwestycyjnego",
      "Powiat lokalizacji przedsięwzięcia deweloperskiego lub zadania inwestycyjnego",
      "Gmina lokalizacji przedsięwzięcia deweloperskiego lub zadania inwestycyjnego",
      "Miejscowość lokalizacji przedsięwzięcia deweloperskiego lub zadania inwestycyjnego",
      "Ulica lokalizacji przedsięwzięcia deweloperskiego lub zadania inwestycyjnego",
      "Nr nieruchomości lokalizacji przedsięwzięcia deweloperskiego lub zadania inwestycyjnego",
      "Kod pocztowy lokalizacji przedsięwzięcia deweloperskiego lub zadania inwestycyjnego",
      "Rodzaj nieruchomości: lokal mieszkalny, dom jednorodzinny",
      "Nr lokalu lub domu jednorodzinnego nadany przez dewelopera",
      "Cena m 2 powierzchni użytkowej lokalu mieszkalnego / domu jednorodzinnego [zł]",
      "Data od której cena obowiązuje cena m 2 powierzchni użytkowej lokalu mieszkalnego / domu jednorodzinnego",
      "Cena lokalu mieszkalnego lub domu jednorodzinnego będących przedmiotem umowy stanowiąca iloczyn ceny m2 oraz powierzchni [zł]",
      "Data od której cena obowiązuje cena lokalu mieszkalnego lub domu jednorodzinnego będących przedmiotem umowy stanowiąca iloczyn ceny m2 oraz powierzchni",
      "Cena lokalu mieszkalnego lub domu jednorodzinnego uwzględniająca cenę lokalu stanowiącą iloczyn powierzchni oraz metrażu i innych składowych ceny, o których mowa w art. 19a ust. 1 pkt 1), 2) lub 3) [zł]",
      "Data od której obowiązuje cena lokalu mieszkalnego lub domu jednorodzinnego uwzględniająca cenę lokalu stanowiącą iloczyn powierzchni oraz metrażu i innych składowych ceny, o których mowa w art. 19a ust. 1 pkt 1), 2) lub 3)",
      "Rodzaj części nieruchomości będących przedmiotem umowy",
      "Oznaczenie części nieruchomości nadane przez dewelopera",
      "Cena części nieruchomości, będących przedmiotem umowy [zł]",
      "Data od której obowiązuje cena części nieruchomości, będących przedmiotem umowy",
      "Rodzaj pomieszczeń przynależnych, o których mowa w art. 2 ust. 4 ustawy z dnia 24 czerwca 1994 r. o własności lokali",
      "Oznaczenie pomieszczeń przynależnych, o których mowa w art. 2 ust. 4 ustawy z dnia 24 czerwca 1994 r. o własności lokali",
      "Wyszczególnienie cen pomieszczeń przynależnych, o których mowa w art. 2 ust. 4 ustawy z dnia 24 czerwca 1994 r. o własności lokali [zł]",
      "Data od której obowiązuje cena wyszczególnionych pomieszczeń przynależnych, o których mowa w art. 2 ust. 4 ustawy z dnia 24 czerwca 1994 r. o własności lokali",
      "Wyszczególnienie praw niezbędnych do korzystania z lokalu mieszkalnego lub domu jednorodzinnego",
      "Wartość praw niezbędnych do korzystania z lokalu mieszkalnego lub domu jednorodzinnego [zł]",
      "Data od której obowiązuje cena wartości praw niezbędnych do korzystania z lokalu mieszkalnego lub domu jednorodzinnego",
      "Wyszczególnienie rodzajów innych świadczeń pieniężnych, które nabywca zobowiązany jest spełnić na rzecz dewelopera w wykonaniu umowy przenoszącej własność",
      "Wartość innych świadczeń pieniężnych, które nabywca zobowiązany jest spełnić na rzecz dewelopera w wykonaniu umowy przenoszącej własność [zł]",
      "Data od której obowiązuje cena wartości innych świadczeń pieniężnych, które nabywca zobowiązany jest spełnić na rzecz dewelopera w wykonaniu umowy przenoszącej własność",
      "Adres strony internetowej, pod którym dostępny jest prospekt informacyjny"
    ];

    // Konwertuj dane do CSV
    const csvContent = [
      headers.join('\t'),
      ...csvData.map(row => row.join('\t'))
    ].join('\n');

    // Dodaj nagłówki dla lepszej kompatybilności
    const responseHeaders = {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ceny-ascana-zamoyskiego-2.csv"',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-cache, must-revalidate',
      'Pragma': 'no-cache'
    };

    return new NextResponse(csvContent, { headers: responseHeaders });
  } catch (error) {
    console.error('Błąd podczas pobierania cen CSV:', error);
    return NextResponse.json(
      { error: 'Błąd podczas pobierania cen CSV' },
      { status: 500 }
    );
  }
}
