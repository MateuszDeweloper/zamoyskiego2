// Konfiguracja URL-i dla assets z bucketa R2
export const getAssetUrl = (path: string): string => {
  // Usuń początkowy slash jeśli istnieje
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Usuń "assets/" z początku ścieżki jeśli istnieje
  const relativePath = cleanPath.startsWith('assets/') ? cleanPath.slice(7) : cleanPath;
  
  // Zwróć pełny URL z bucketa R2 - używaj zmiennej środowiskowej lub fallback
  // Pliki są w buckecie pod assets/assets/ przez co upload się odbył
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-87b84208ccf34255b805f85fec3df301.r2.dev';
  return `${baseUrl}/assets/assets/${relativePath}`;
};

// Mapowanie starych ścieżek na nowe
export const ASSET_PATHS = {
  // Logo
  logoWithBg: getAssetUrl('logo-bg.png'),
  logoWhite: getAssetUrl('logo-nobg-white.png'),
  logoStandard: getAssetUrl('logo-nobg.png'),
  
  // Zdjęcia główne
  photos: {
    image11_000: getAssetUrl('photos/Image11_000.png'),
    image11_001: getAssetUrl('photos/Image11_001.png'),
    image13_000: getAssetUrl('photos/Image13_000.png'),
    image13_001: getAssetUrl('photos/Image13_001.png'),
    image13_002: getAssetUrl('photos/Image13_002.png'),
    image14: getAssetUrl('photos/Image14.png'),
    image15: getAssetUrl('photos/Image15.png'),
    image15_000: getAssetUrl('photos/Image15_000.png'),
    image16: getAssetUrl('photos/Image16.png'),
    image17: getAssetUrl('photos/Image17.png'),
    image17_000: getAssetUrl('photos/Image17_000.png'),
    image18: getAssetUrl('photos/Image18.png'),
    image18_000: getAssetUrl('photos/Image18_000.png'),
    image19: getAssetUrl('photos/Image19.png'),
    image19_000: getAssetUrl('photos/Image19_000.png'),
    image20: getAssetUrl('photos/Image20.png'),
    image20_000: getAssetUrl('photos/Image20_000.png'),
    image21: getAssetUrl('photos/Image21.png'),
    image21_000: getAssetUrl('photos/Image21_000.png'),
    image23: getAssetUrl('photos/Image23.png'),
    image23_000: getAssetUrl('photos/Image23_000.png'),
    image24: getAssetUrl('photos/Image24.png'),
    image24_000: getAssetUrl('photos/Image24_000.png'),
  },
  
  // Osiedle Osowiec
  osiedleOsowiec: {
    wizualizacja1: getAssetUrl('osiedle-osowiec/wizualizacje/1.jpg'),
  },
  
  // Prospekt
  prospekt: getAssetUrl('PROSPEKT/prospekt informacyjny zamoyskiego 2 (WSTĘPNY).pdf'),
  
  // PZT
  pzt: {
    mapa1: getAssetUrl('PZT/MAPA1.pdf'),
    mapa2: getAssetUrl('PZT/MAPA2.pdf'),
    mapa3: getAssetUrl('PZT/MAPA3.pdf'),
  },
  
  // Rzuty - generujemy dynamicznie
  getRzutUrl: (buildingNumber: string | number, unitNumber: string | number) => 
    getAssetUrl(`Rzuty/${buildingNumber}${unitNumber}.pdf`),
};

// Helper do generowania URL-i rzutów
export const getRzutUrl = (buildingNumber: string | number, unitNumber: string | number): string => {
  return ASSET_PATHS.getRzutUrl(buildingNumber, unitNumber);
};
