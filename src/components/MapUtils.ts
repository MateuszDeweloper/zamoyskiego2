import { Vertex } from '@/data/propertyUnits';

// Funkcje pomocnicze dla mapy

// Funkcja obsługująca przeciąganie wierzchołków w trybie deweloperskim
export const handleVertexDrag = (
  isDraggingVertex: {
    polygon: number;
    vertex: number;
    offsetX?: number;
    offsetY?: number;
  } | null,
  currentPolygonVertices: Vertex[][],
  setCurrentPolygonVertices: React.Dispatch<React.SetStateAction<Vertex[][]>>,
  e: MouseEvent
) => {
  if (!isDraggingVertex) return;
  
  // Pobieramy element SVG
  const svg = document.querySelector('svg');
  if (!svg) return;
  
  // Pobieramy pozycję SVG względem okna przeglądarki
  const rect = svg.getBoundingClientRect();
  
  // Obliczamy współrzędne myszy względem SVG
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  // Dodajemy zapisany offset, aby punkt pozostał w tej samej pozycji
  // względem kursora co w momencie rozpoczęcia przeciągania
  const newX = mouseX + (isDraggingVertex.offsetX || 0);
  const newY = mouseY + (isDraggingVertex.offsetY || 0);
  
  // Aktualizacja współrzędnych wierzchołka dla odpowiedniego wielokąta
  const newVertices = [...currentPolygonVertices];
  newVertices[isDraggingVertex.polygon] = [...newVertices[isDraggingVertex.polygon]];
  newVertices[isDraggingVertex.polygon][isDraggingVertex.vertex] = { x: newX, y: newY };
  setCurrentPolygonVertices(newVertices);
};

// Funkcja aktualizująca wierzchołek wielokąta przy przeciąganiu
export const updatePolygonVertex = (
  polygons: Vertex[][],
  isDraggingVertex: { polygon: number; vertex: number } | null,
  newX: number,
  newY: number
): Vertex[][] => {
  if (!isDraggingVertex) return polygons;

  const { polygon, vertex } = isDraggingVertex;
  
  // Sprawdzamy, czy istnieje taki wielokąt i wierzchołek
  if (!polygons[polygon] || !polygons[polygon][vertex]) {
    return polygons;
  }

  // Aktualizujemy współrzędne
  const updatedPolygons = [...polygons];
  updatedPolygons[polygon] = [...updatedPolygons[polygon]];
  updatedPolygons[polygon][vertex] = { x: newX, y: newY };

  return updatedPolygons;
};

import { persistChanges } from '@/data/config';

// Funkcja zapisująca aktualne współrzędne wielokątów do API i do localStorage jako zabezpieczenie
export const savePolygonsToLocalStorage = async (currentPolygonVertices: Vertex[][], propertyUnits?: any[]): Promise<boolean> => {
  try {
    console.log('Zapisywanie wielokątów do localStorage i API:', currentPolygonVertices);
    
    // Przygotuj dane do wysłania do API
    if (propertyUnits && propertyUnits.length > 0) {
      const polygonsData = currentPolygonVertices.map((vertices, index) => {
        const unit = propertyUnits[index];
        return {
          buildingNumber: unit?.buildingNumber,
          unitNumber: unit?.unitNumber,
          vertices: vertices
        };
      }).filter(polygon => polygon.buildingNumber && polygon.unitNumber);
      
      // Wyślij do API
      try {
        const response = await fetch('/api/polygons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ polygons: polygonsData }),
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Zapisano do API:', result);
        } else {
          console.error('Błąd podczas zapisywania do API:', response.statusText);
        }
      } catch (apiError) {
        console.error('Błąd podczas wysyłania do API:', apiError);
      }
    }
    
    // Zapisujemy do localStorage jako zabezpieczenie
    currentPolygonVertices.forEach((vertices, index) => {
      const storageKey = `polygon_${index + 1}`;
      const dataToSave = JSON.stringify(vertices);
      localStorage.setItem(storageKey, dataToSave);
      console.log(`Zapisano wielokąt ${index + 1}:`, dataToSave);
    });
    
    // Zapisujemy liczbę wielokątów
    localStorage.setItem('polygonsCount', currentPolygonVertices.length.toString());
    console.log('Zapisano liczbę wielokątów:', currentPolygonVertices.length);
    
    // Zapisujemy flagę informującą, że dane zostały zapisane
    localStorage.setItem('polygons_saved', 'true');
    console.log('Ustawiono flagę polygons_saved=true');
    
    return true;
  } catch (e) {
    console.error('Błąd podczas zapisywania wielokątów:', e);
    return false;
  }
};

// Funkcja wczytująca zapisane współrzędne wielokątów z localStorage
export const loadPolygonsFromLocalStorage = async (expectedPolygonsCount: number): Promise<Vertex[][] | null> => {
  try {
    console.log('Ładowanie wielokątów z localStorage, oczekiwana liczba:', expectedPolygonsCount);
    
    let storedCount = 0;
    const countStr = localStorage.getItem('polygonsCount');
    if (countStr) {
      storedCount = parseInt(countStr);
      console.log('Znaleziono zapisaną liczbę wielokątów:', storedCount);
    } else {
      while (localStorage.getItem(`polygon_${storedCount + 1}`)) {
        storedCount++;
      }
      console.log('Wykryto liczbę wielokątów:', storedCount);
    }
    
    // Jeśli liczba się nie zgadza, wyświetlamy ostrzeżenie (ale kontynuujemy)
    if (storedCount !== expectedPolygonsCount) {
      console.warn(`Liczba zapisanych wielokątów (${storedCount}) różni się od oczekiwanej (${expectedPolygonsCount})`);
    }
    
    // Jeśli nie ma żadnych zapisanych wielokątów, zwracamy null
    if (storedCount === 0) {
      console.log('Brak zapisanych wielokątów w localStorage');
      return null;
    }
    
    // Wczytujemy wielokąty z localStorage
    const loadedPolygons: Vertex[][] = [];
    
    for (let i = 0; i < expectedPolygonsCount; i++) {
      const storageKey = `polygon_${i + 1}`;
      const storedData = localStorage.getItem(storageKey);
      
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          console.log(`Załadowano wielokąt ${i + 1}:`, parsedData);
          
          // Sprawdzamy format danych - czy to tablica wierzchołków
          if (Array.isArray(parsedData) && parsedData.length > 0 && 
              typeof parsedData[0] === 'object' && 'x' in parsedData[0] && 'y' in parsedData[0]) {
            loadedPolygons[i] = parsedData;
          } else {
            console.error(`Nieprawidłowy format danych dla wielokąta ${i + 1}`);
          }
        } catch (parseError) {
          console.error(`Błąd parsowania danych dla wielokąta ${i + 1}:`, parseError);
        }
      } else {
        console.log(`Brak danych dla wielokąta ${i + 1}`);
      }
    }
    
    // Sprawdzamy, czy udało się załadować jakiekolwiek dane
    return loadedPolygons.length > 0 ? loadedPolygons : null;
  } catch (e) {
    console.error('Błąd podczas ładowania wielokątów z localStorage:', e);
    return null;
  }
};

// Funkcja pomocnicza do kopiowania współrzędnych wielokątów
export const copyPolygonCoordinates = (polygons: Vertex[][]) => {
  try {
    const formattedText = polygons.map((polygon, index) => {
      return `// Wielokąt ${index + 1}\nexport const polygonVertices${index > 0 ? index + 1 : ''}: Vertex[] = ${JSON.stringify(polygon, null, 2)};`;
    }).join('\n\n');
    
    navigator.clipboard.writeText(formattedText);
    console.log('Skopiowano współrzędne wielokątów do schowka');
    return true;
  } catch (e) {
    console.error('Błąd podczas kopiowania współrzędnych:', e);
    return false;
  }
};

// Funkcja zapisująca wielokąty do pliku
export const savePolygonsToFile = async (polygons: Vertex[][]) => {
  try {
    const formattedData = JSON.stringify(polygons, null, 2);
    
    // Tworzenie obiektu Blob z danymi
    const blob = new Blob([formattedData], { type: 'application/json' });
    
    // Tworzenie URL dla Blob
    const url = URL.createObjectURL(blob);
    
    // Tworzenie elementu <a> do pobrania pliku
    const a = document.createElement('a');
    a.href = url;
    a.download = 'polygon_data.json';
    
    // Dodanie elementu do DOM, kliknięcie i usunięcie
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Zwolnienie URL
    URL.revokeObjectURL(url);
    
    console.log('Zapisano wielokąty do pliku');
    return true;
  } catch (e) {
    console.error('Błąd podczas zapisywania wielokątów do pliku:', e);
    return false;
  }
};