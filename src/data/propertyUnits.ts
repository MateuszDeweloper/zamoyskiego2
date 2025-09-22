// Interface dla lokali Zamoyskiego 2
export interface PropertyUnit {
  buildingNumber: string | number;
  unitNumber: string | number;
  area: number;
  price: number;
  pricePerM2: number;
  auxiliaryRooms?: string;
  isAvailable: boolean;
  status?: 'available' | 'unavailable' | 'sold-transferred' | 'sold-not-transferred' | 'reserved';
  floor?: string;
  plans?: {
    parter?: string;
    pietro?: string;
  };
}

// Interface dla wierzchołków wielokątów
export interface Vertex {
  x: number;
  y: number;
}

// Funkcja zwracająca wszystkie lokale
export function getAllPropertyUnits(): PropertyUnit[] {
  return propertyUnits;
}

// Funkcja mapująca PropertyUnit na format używany przez mapę
export const mapPropertyUnitsToPolygons = (units: PropertyUnit[]) => {
  console.log('mapPropertyUnitsToPolygons - otrzymane jednostki:', units);
  
  if (!Array.isArray(units) || units.length === 0) {
    console.warn('mapPropertyUnitsToPolygons - brak jednostek lub nieprawidłowy format');
    return [];
  }
  
  return units.map((unit, index) => {
    if (!unit) {
      console.error(`mapPropertyUnitsToPolygons - jednostka ${index} jest undefined lub null`);
      return {
        vertices: [],
        houseIndex: index,
        buildingNumber: 'unknown',
        unitNumber: 'unknown',
        status: 'unavailable',
        isAvailable: false
      };
    }
    
    console.log(`mapPropertyUnitsToPolygons - mapowanie jednostki ${index}:`, unit);
    
    // Użyj współrzędnych z bazy danych jeśli są dostępne, w przeciwnym razie użyj domyślnych
    const vertices = getPolygonVertices(unit.buildingNumber, unit.unitNumber, (unit as any).vertices);
    
    return {
      vertices,
      houseIndex: index,
      buildingNumber: unit.buildingNumber,
      unitNumber: unit.unitNumber,
      status: unit.status || 'available',
      isAvailable: unit.isAvailable !== undefined ? unit.isAvailable : true
    };
  });
};

// Funkcja zwracająca współrzędne wielokąta dla danego lokalu
export const getPolygonVertices = (buildingNumber: string | number, unitNumber: string | number, customVertices?: Vertex[]): Vertex[] => {
  // Jeśli mamy niestandardowe współrzędne (z bazy danych), użyj ich
  if (customVertices && customVertices.length > 0) {
    console.log(`Używam niestandardowych współrzędnych dla ${buildingNumber}${unitNumber}:`, customVertices);
    return customVertices;
  }
  
  // Normalizacja danych wejściowych
  let normalizedBuildingNumber = buildingNumber;
  let normalizedUnitNumber = unitNumber;
  
  // Zapewnienie, że buildingNumber jest liczbą lub stringiem reprezentującym liczbę
  if (typeof normalizedBuildingNumber === 'string') {
    normalizedBuildingNumber = normalizedBuildingNumber.trim();
  }
  
  // Zapewnienie, że unitNumber jest stringiem 'A' lub 'B'
  if (typeof normalizedUnitNumber === 'string') {
    normalizedUnitNumber = normalizedUnitNumber.trim().toUpperCase();
  }
  
  // Tworzenie klucza w standardowym formacie
  const key = `${normalizedBuildingNumber}${normalizedUnitNumber}`;
  console.log(`Szukam wielokąta dla klucza: ${key}`);
  
  // Mapa współrzędnych dla lokali Zamoyskiego 2
  const polygonMap: Record<string, Vertex[]> = {
    // Budynek 1
    "1A": [
      { x: 200, y: 150 },
      { x: 225, y: 140 },
      { x: 250, y: 150 },
      { x: 250, y: 175 },
      { x: 225, y: 200 },
      { x: 200, y: 175 }
    ],
    "1B": [
      { x: 200, y: 210 },
      { x: 225, y: 200 },
      { x: 250, y: 210 },
      { x: 250, y: 235 },
      { x: 225, y: 260 },
      { x: 200, y: 235 }
    ],
    // Budynek 2
    "2A": [
      { x: 270, y: 150 },
      { x: 295, y: 140 },
      { x: 320, y: 150 },
      { x: 320, y: 175 },
      { x: 295, y: 200 },
      { x: 270, y: 175 }
    ],
    "2B": [
      { x: 270, y: 210 },
      { x: 295, y: 200 },
      { x: 320, y: 210 },
      { x: 320, y: 235 },
      { x: 295, y: 260 },
      { x: 270, y: 235 }
    ],
    // Budynek 3
    "3A": [
      { x: 340, y: 150 },
      { x: 365, y: 140 },
      { x: 390, y: 150 },
      { x: 390, y: 175 },
      { x: 365, y: 200 },
      { x: 340, y: 175 }
    ],
    "3B": [
      { x: 340, y: 210 },
      { x: 365, y: 200 },
      { x: 390, y: 210 },
      { x: 390, y: 235 },
      { x: 365, y: 260 },
      { x: 340, y: 235 }
    ],
    // Budynek 4
    "4A": [
      { x: 410, y: 150 },
      { x: 435, y: 140 },
      { x: 460, y: 150 },
      { x: 460, y: 175 },
      { x: 435, y: 200 },
      { x: 410, y: 175 }
    ],
    "4B": [
      { x: 410, y: 210 },
      { x: 435, y: 200 },
      { x: 460, y: 210 },
      { x: 460, y: 235 },
      { x: 435, y: 260 },
      { x: 410, y: 235 }
    ],
    // Budynek 5
    "5A": [
      { x: 480, y: 150 },
      { x: 505, y: 140 },
      { x: 530, y: 150 },
      { x: 530, y: 175 },
      { x: 505, y: 200 },
      { x: 480, y: 175 }
    ],
    "5B": [
      { x: 480, y: 210 },
      { x: 505, y: 200 },
      { x: 530, y: 210 },
      { x: 530, y: 235 },
      { x: 505, y: 260 },
      { x: 480, y: 235 }
    ],
    // Budynek 6
    "6A": [
      { x: 550, y: 150 },
      { x: 575, y: 140 },
      { x: 600, y: 150 },
      { x: 600, y: 175 },
      { x: 575, y: 200 },
      { x: 550, y: 175 }
    ],
    "6B": [
      { x: 550, y: 210 },
      { x: 575, y: 200 },
      { x: 600, y: 210 },
      { x: 600, y: 235 },
      { x: 575, y: 260 },
      { x: 550, y: 235 }
    ],
    // Budynek 7
    "7A": [
      { x: 620, y: 150 },
      { x: 645, y: 140 },
      { x: 670, y: 150 },
      { x: 670, y: 175 },
      { x: 645, y: 200 },
      { x: 620, y: 175 }
    ],
    "7B": [
      { x: 620, y: 210 },
      { x: 645, y: 200 },
      { x: 670, y: 210 },
      { x: 670, y: 235 },
      { x: 645, y: 260 },
      { x: 620, y: 235 }
    ],
    // Budynek 8
    "8A": [
      { x: 200, y: 300 },
      { x: 225, y: 290 },
      { x: 250, y: 300 },
      { x: 250, y: 325 },
      { x: 225, y: 350 },
      { x: 200, y: 325 }
    ],
    "8B": [
      { x: 200, y: 360 },
      { x: 225, y: 350 },
      { x: 250, y: 360 },
      { x: 250, y: 385 },
      { x: 225, y: 410 },
      { x: 200, y: 385 }
    ],
    // Budynek 9
    "9A": [
      { x: 270, y: 300 },
      { x: 295, y: 290 },
      { x: 320, y: 300 },
      { x: 320, y: 325 },
      { x: 295, y: 350 },
      { x: 270, y: 325 }
    ],
    "9B": [
      { x: 270, y: 360 },
      { x: 295, y: 350 },
      { x: 320, y: 360 },
      { x: 320, y: 385 },
      { x: 295, y: 410 },
      { x: 270, y: 385 }
    ],
    // Budynek 10
    "10A": [
      { x: 340, y: 300 },
      { x: 365, y: 290 },
      { x: 390, y: 300 },
      { x: 390, y: 325 },
      { x: 365, y: 350 },
      { x: 340, y: 325 }
    ],
    "10B": [
      { x: 340, y: 360 },
      { x: 365, y: 350 },
      { x: 390, y: 360 },
      { x: 390, y: 385 },
      { x: 365, y: 410 },
      { x: 340, y: 385 }
    ],
    // Budynek 11
    "11A": [
      { x: 410, y: 300 },
      { x: 435, y: 290 },
      { x: 460, y: 300 },
      { x: 460, y: 325 },
      { x: 435, y: 350 },
      { x: 410, y: 325 }
    ],
    "11B": [
      { x: 410, y: 360 },
      { x: 435, y: 350 },
      { x: 460, y: 360 },
      { x: 460, y: 385 },
      { x: 435, y: 410 },
      { x: 410, y: 385 }
    ],
    // Budynek 12
    "12A": [
      { x: 480, y: 300 },
      { x: 505, y: 290 },
      { x: 530, y: 300 },
      { x: 530, y: 325 },
      { x: 505, y: 350 },
      { x: 480, y: 325 }
    ],
    "12B": [
      { x: 480, y: 360 },
      { x: 505, y: 350 },
      { x: 530, y: 360 },
      { x: 530, y: 385 },
      { x: 505, y: 410 },
      { x: 480, y: 385 }
    ],
    // Budynek 13
    "13A": [
      { x: 550, y: 300 },
      { x: 575, y: 290 },
      { x: 600, y: 300 },
      { x: 600, y: 325 },
      { x: 575, y: 350 },
      { x: 550, y: 325 }
    ],
    "13B": [
      { x: 550, y: 360 },
      { x: 575, y: 350 },
      { x: 600, y: 360 },
      { x: 600, y: 385 },
      { x: 575, y: 410 },
      { x: 550, y: 385 }
    ]
  };
  
  // Sprawdzenie, czy klucz istnieje w mapie
  if (polygonMap[key]) {
    console.log(`Znaleziono wielokąt dla klucza: ${key}`);
    return polygonMap[key];
  }
  
  // Próba alternatywnych kluczy
  // Próba z numerem budynku jako liczbą
  const numericBuildingKey = `${Number(normalizedBuildingNumber)}${normalizedUnitNumber}`;
  if (numericBuildingKey !== key && polygonMap[numericBuildingKey]) {
    console.log(`Znaleziono wielokąt dla alternatywnego klucza: ${numericBuildingKey}`);
    return polygonMap[numericBuildingKey];
  }
  
  // Jeśli nadal nie znaleziono, użyj domyślnych wartości
  console.log(`Nie znaleziono wielokąta dla klucza: ${key}, używam domyślnych wartości`);
  return [
    { x: 300, y: 300 },
    { x: 325, y: 290 },
    { x: 350, y: 300 },
    { x: 350, y: 325 },
    { x: 325, y: 350 },
    { x: 300, y: 325 }
  ];
};

// Dane dla lokali Zamoyskiego 2
export const propertyUnits: PropertyUnit[] = [
  // Lokale 1A-13B zgodnie z danymi
  {
    buildingNumber: 1,
    unitNumber: "A",
    area: 56.46,
    price: 429000,
    pricePerM2: Math.round(429000 / 56.46),
    isAvailable: true,
    status: 'available',
    floor: 'parter'
  },
  {
    buildingNumber: 1,
    unitNumber: "B",
    area: 59.32,
    price: 429000,
    pricePerM2: Math.round(429000 / 59.32),
    isAvailable: true,
    status: 'available',
    floor: 'piętro + ogródek',
    auxiliaryRooms: 'Ogródek'
  },
  {
    buildingNumber: 2,
    unitNumber: "A",
    area: 56.46,
    price: 429000,
    pricePerM2: Math.round(429000 / 56.46),
    isAvailable: true,
    status: 'available',
    floor: 'parter'
  },
  {
    buildingNumber: 2,
    unitNumber: "B",
    area: 59.32,
    price: 399000,
    pricePerM2: Math.round(399000 / 59.32),
    isAvailable: true,
    status: 'available',
    floor: 'piętro'
  },
  {
    buildingNumber: 3,
    unitNumber: "A",
    area: 56.46,
    price: 429000,
    pricePerM2: Math.round(429000 / 56.46),
    isAvailable: true,
    status: 'available',
    floor: 'parter'
  },
  {
    buildingNumber: 3,
    unitNumber: "B",
    area: 59.32,
    price: 399000,
    pricePerM2: Math.round(399000 / 59.32),
    isAvailable: true,
    status: 'available',
    floor: 'piętro'
  },
  {
    buildingNumber: 4,
    unitNumber: "A",
    area: 56.46,
    price: 429000,
    pricePerM2: Math.round(429000 / 56.46),
    isAvailable: true,
    status: 'available',
    floor: 'parter'
  },
  {
    buildingNumber: 4,
    unitNumber: "B",
    area: 59.32,
    price: 399000,
    pricePerM2: Math.round(399000 / 59.32),
    isAvailable: true,
    status: 'available',
    floor: 'piętro'
  },
  {
    buildingNumber: 5,
    unitNumber: "A",
    area: 56.46,
    price: 429000,
    pricePerM2: Math.round(429000 / 56.46),
    isAvailable: true,
    status: 'available',
    floor: 'parter'
  },
  {
    buildingNumber: 5,
    unitNumber: "B",
    area: 59.32,
    price: 399000,
    pricePerM2: Math.round(399000 / 59.32),
    isAvailable: true,
    status: 'available',
    floor: 'piętro'
  },
  {
    buildingNumber: 6,
    unitNumber: "A",
    area: 56.46,
    price: 429000,
    pricePerM2: Math.round(429000 / 56.46),
    isAvailable: true,
    status: 'available',
    floor: 'parter'
  },
  {
    buildingNumber: 6,
    unitNumber: "B",
    area: 59.32,
    price: 399000,
    pricePerM2: Math.round(399000 / 59.32),
    isAvailable: true,
    status: 'available',
    floor: 'piętro'
  },
  {
    buildingNumber: 7,
    unitNumber: "A",
    area: 56.46,
    price: 429000,
    pricePerM2: Math.round(429000 / 56.46),
    isAvailable: true,
    status: 'available',
    floor: 'parter'
  },
  {
    buildingNumber: 7,
    unitNumber: "B",
    area: 59.32,
    price: 399000,
    pricePerM2: Math.round(399000 / 59.32),
    isAvailable: true,
    status: 'available',
    floor: 'piętro'
  },
  {
    buildingNumber: 8,
    unitNumber: "A",
    area: 56.46,
    price: 429000,
    pricePerM2: Math.round(429000 / 56.46),
    isAvailable: true,
    status: 'available',
    floor: 'parter'
  },
  {
    buildingNumber: 8,
    unitNumber: "B",
    area: 59.32,
    price: 399000,
    pricePerM2: Math.round(399000 / 59.32),
    isAvailable: true,
    status: 'available',
    floor: 'piętro'
  },
  {
    buildingNumber: 9,
    unitNumber: "A",
    area: 56.46,
    price: 429000,
    pricePerM2: Math.round(429000 / 56.46),
    isAvailable: true,
    status: 'available',
    floor: 'parter'
  },
  {
    buildingNumber: 9,
    unitNumber: "B",
    area: 59.32,
    price: 399000,
    pricePerM2: Math.round(399000 / 59.32),
    isAvailable: true,
    status: 'available',
    floor: 'piętro'
  },
  {
    buildingNumber: 10,
    unitNumber: "A",
    area: 56.46,
    price: 429000,
    pricePerM2: Math.round(429000 / 56.46),
    isAvailable: true,
    status: 'available',
    floor: 'parter'
  },
  {
    buildingNumber: 10,
    unitNumber: "B",
    area: 59.32,
    price: 399000,
    pricePerM2: Math.round(399000 / 59.32),
    isAvailable: true,
    status: 'available',
    floor: 'piętro'
  },
  {
    buildingNumber: 11,
    unitNumber: "A",
    area: 56.46,
    price: 429000,
    pricePerM2: Math.round(429000 / 56.46),
    isAvailable: true,
    status: 'available',
    floor: 'parter'
  },
  {
    buildingNumber: 11,
    unitNumber: "B",
    area: 59.32,
    price: 399000,
    pricePerM2: Math.round(399000 / 59.32),
    isAvailable: true,
    status: 'available',
    floor: 'piętro'
  },
  {
    buildingNumber: 12,
    unitNumber: "A",
    area: 56.46,
    price: 399000,
    pricePerM2: Math.round(399000 / 56.46),
    isAvailable: true,
    status: 'available',
    floor: 'parter'
  },
  {
    buildingNumber: 12,
    unitNumber: "B",
    area: 59.32,
    price: 399000,
    pricePerM2: Math.round(399000 / 59.32),
    isAvailable: true,
    status: 'available',
    floor: 'piętro'
  },
  {
    buildingNumber: 13,
    unitNumber: "A",
    area: 56.46,
    price: 429000,
    pricePerM2: Math.round(429000 / 56.46),
    isAvailable: true,
    status: 'available',
    floor: 'parter'
  },
  {
    buildingNumber: 13,
    unitNumber: "B",
    area: 59.32,
    price: 399000,
    pricePerM2: Math.round(399000 / 59.32),
    isAvailable: true,
    status: 'available',
    floor: 'piętro + ogródek',
    auxiliaryRooms: 'Ogródek'
  }
];

// Styl wielokąta
export const polygonStyle = {
  borderColor: "#d7c28d", // Kolor obramowania
  borderWidth: 3,         // Grubość obramowania
  showVertexNumbers: false // Czy pokazywać numery wierzchołków
};