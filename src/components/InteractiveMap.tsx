"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PropertyUnit, Vertex } from '@/data/propertyUnits';
import { polygonStyle } from '@/data/propertyUnits';
import { developerMode, persistChanges } from '@/data/config';
import toast from 'react-hot-toast';
import { useMediaQuery } from 'react-responsive';
import PolygonOverlay from './PolygonOverlay';
import MapTooltip from './MapTooltip';
import DeveloperPanel from './DeveloperPanel';
import { copyPolygonCoordinates, savePolygonsToLocalStorage, loadPolygonsFromLocalStorage } from './MapUtils';

interface InteractiveMapProps {
  propertyUnits: PropertyUnit[];
  polygons: {
    vertices: Vertex[];
    houseIndex: number;
    buildingNumber: string | number;
    unitNumber: string | number;
    status?: 'available' | 'unavailable' | 'sold-transferred' | 'sold-not-transferred' | 'reserved';
    isAvailable: boolean;
  }[];
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ propertyUnits, polygons }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTooltips, setActiveTooltips] = useState<boolean[]>(Array(polygons.length).fill(false));
  const mapRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mobileActivePolygon, setMobileActivePolygon] = useState<number | null>(null);
  const [highlightedPolygon, setHighlightedPolygon] = useState<number | null>(null);
  
  // Logowanie danych wejściowych dla debugowania
  useEffect(() => {
    console.log('InteractiveMap - propertyUnits:', propertyUnits);
    console.log('InteractiveMap - polygons:', polygons);
    
    // Sprawdzenie, czy są jakieś problemy z mapowaniem
    polygons.forEach((polygon, index) => {
      if (!polygon.vertices || polygon.vertices.length === 0) {
        console.error(`Brak wierzchołków dla polygonu ${index}, budynek ${polygon.buildingNumber}${polygon.unitNumber}`);
      }
    });
  }, [propertyUnits, polygons]);
  
  // Wykrywanie urządzeń mobilnych
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  // Stany dla panelu deweloperskiego
  const [isCopySuccess, setIsCopySuccess] = useState(false);
  // Stan panelu deweloperskiego - możliwość chowania
  const [isDevPanelOpen, setIsDevPanelOpen] = useState(true);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  
  // Stan widoczności obszarów w trybie deweloperskim
  const [areasVisibility, setAreasVisibility] = useState<boolean[]>(Array(polygons.length).fill(true));
  
  // Stan do śledzenia przeciąganych wierzchołków
  const [isDraggingVertex, setIsDraggingVertex] = useState<{
    polygonIndex: number;
    vertexIndex: number;
    offsetX?: number;
    offsetY?: number;
  } | null>(null);
  
  // Stan do śledzenia przeciąganych wielokątów
  const [isDraggingPolygon, setIsDraggingPolygon] = useState<{
    polygonIndex: number;
    offsetX?: number;
    offsetY?: number;
  } | null>(null);
  
  // Stan informujący, czy dane są już zainicjalizowane z localStorage
  const isInitializedRef = useRef<boolean>(false);
  const wasSavedDataLoadedRef = useRef<boolean>(false);
  
  // Flaga wskazująca, czy edytowano już wielokąty
  const [hasEdited, setHasEdited] = useState<boolean>(false);
  
  // Stan do przechowywania zmodyfikowanych wielokątów
  const [modifiedPolygons, setModifiedPolygons] = useState<typeof polygons>([...polygons]);
  
  // Referencja do poprzedniego stanu polygons
  const previousPolygonsRef = useRef([...polygons]);
  
  // Funkcja przełączania widoczności obszaru
  const toggleAreaVisibility = (index: number) => {
    setAreasVisibility(prev => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  // Funkcja włączająca wszystkie obszary
  const showAllAreas = () => {
    setAreasVisibility(Array(polygons.length).fill(true));
  };

  // Funkcja wyłączająca wszystkie obszary
  const hideAllAreas = () => {
    setAreasVisibility(Array(polygons.length).fill(false));
  };
  
  // Inicjalizacja przy pierwszym renderowaniu
  useEffect(() => {
    // Nie czyszczmy localStorage automatycznie - pozwolmy na zachowanie zapisanych zmian
    // nawet gdy tryb deweloperski zostanie wyłączony
    
    const initializeFromLocalStorage = async () => {
      try {
        // Sprawdzamy, czy dane były zapisane wcześniej
        const wasSaved = localStorage.getItem('polygons_saved') === 'true';
        console.log('Czy dane były wcześniej zapisane:', wasSaved);
        
        // Jeśli persistChanges=false, nie ładujemy zapisanych danych
        if (!persistChanges) {
          console.log('Pomijanie ładowania z localStorage - persistChanges=false');
          return;
        }
        
        // Jeśli nie ma zapisanych danych, również nie ładujemy
        if (!wasSaved) {
          console.log('Brak zapisanych danych w localStorage');
          return;
        }
        
        const loaded = await loadPolygonsFromLocalStorage(polygons.length);
        
        if (loaded) {
          // Konwersja wczytanych wierzchołków do formatu komponentu
          const formattedPolygons = polygons.map((polygon, index) => ({
            vertices: loaded[index] || polygon.vertices,
            houseIndex: polygon.houseIndex,
            buildingNumber: polygon.buildingNumber,
            unitNumber: polygon.unitNumber,
            status: polygon.status,
            isAvailable: polygon.isAvailable
          }));
          
          setModifiedPolygons(formattedPolygons);
          setHasEdited(true);
          isInitializedRef.current = true;
          wasSavedDataLoadedRef.current = true;
          console.log('Załadowano zapisane dane z localStorage');
        }
      } catch (error) {
        console.error('Błąd podczas inicjalizacji z localStorage:', error);
      }
    };
    
    // Wykonujemy inicjalizację tylko raz
    if (!wasSavedDataLoadedRef.current) {
      initializeFromLocalStorage();
    }
  }, [polygons]);

  // Aktualizacja modifiedPolygons gdy zmienią się props.polygons, ale tylko jeśli nie ma zmian zapisanych
  useEffect(() => {
    // Porównanie z poprzednimi wielokątami
    const hasPolygonsChanged = JSON.stringify(previousPolygonsRef.current) !== JSON.stringify(polygons);
    
    if (hasPolygonsChanged) {
      previousPolygonsRef.current = [...polygons];
      
      // Aktualizujemy modifiedPolygons tylko jeśli nie ma zapisanych zmian
      if (!isInitializedRef.current && !hasEdited) {
        setModifiedPolygons([...polygons]);
      }
    }
  }, [polygons, hasEdited]);

  // Obsługa przechwycenia zdarzenia myszy i dotyku dla wierzchołka - początek przeciągania
  const handleVertexMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent, vertexIndex: number, polygonIndex: number) => {
      // Zapobieganie dalszemu propagowaniu zdarzenia
      e.preventDefault();
      e.stopPropagation();
      
      if (developerMode) {
        // Pobieramy element SVG
        const svgElement = document.getElementById("map-svg");
        if (!svgElement) return;
        
        // Pobieramy pozycję SVG względem okna przeglądarki
        const svgRect = svgElement.getBoundingClientRect();
        
        // Pobieramy aktualną pozycję punktu
        const currentVertex = modifiedPolygons[polygonIndex].vertices[vertexIndex];
        
        // Obsługa zarówno myszy jak i dotyku
        const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
        
        // Walidacja współrzędnych
        if (typeof clientX !== 'number' || typeof clientY !== 'number' || 
            !isFinite(clientX) || !isFinite(clientY)) {
          return;
        }
        
        // Obliczamy pozycję kursora względem SVG
        const mouseX = clientX - svgRect.left;
        const mouseY = clientY - svgRect.top;
        
        // Ustawiamy stan przeciągania z zapisaniem offsetu myszy względem punktu
        setIsDraggingVertex({
          polygonIndex,
          vertexIndex,
          offsetX: currentVertex.x - mouseX,
          offsetY: currentVertex.y - mouseY
        });
      }
    },
    [developerMode, modifiedPolygons]
  );

  // Obsługa przechwycenia zdarzenia myszy i dotyku dla wielokąta - początek przeciągania
  const handlePolygonMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent, polygonIndex: number) => {
      // Zapobieganie dalszemu propagowaniu zdarzenia
      e.preventDefault();
      e.stopPropagation();
      
      if (developerMode) {
        // Pobieramy element SVG
        const svgElement = document.getElementById("map-svg");
        if (!svgElement) return;
        
        // Pobieramy pozycję SVG względem okna przeglądarki
        const svgRect = svgElement.getBoundingClientRect();
        
        // Obliczamy środek wielokąta
        const vertices = modifiedPolygons[polygonIndex].vertices;
        const centerX = vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length;
        const centerY = vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length;
        
        // Obsługa zarówno myszy jak i dotyku
        const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
        
        // Walidacja współrzędnych
        if (typeof clientX !== 'number' || typeof clientY !== 'number' || 
            !isFinite(clientX) || !isFinite(clientY)) {
          return;
        }
        
        // Obliczamy pozycję kursora względem SVG
        const mouseX = clientX - svgRect.left;
        const mouseY = clientY - svgRect.top;
        
        // Ustawiamy stan przeciągania z zapisaniem offsetu myszy względem środka
        setIsDraggingPolygon({
          polygonIndex,
          offsetX: centerX - mouseX,
          offsetY: centerY - mouseY
        });
      }
    },
    [developerMode, modifiedPolygons]
  );

  // Obsługa ruchu myszy i dotyku podczas przeciągania wierzchołka lub wielokąta
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!developerMode) return;
    
    const svgElement = document.getElementById("map-svg");
    if (!svgElement) return;

    const svgRect = svgElement.getBoundingClientRect();
    
    // Obsługa zarówno myszy jak i dotyku
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
    
    // Walidacja współrzędnych
    if (typeof clientX !== 'number' || typeof clientY !== 'number' || 
        !isFinite(clientX) || !isFinite(clientY)) {
      return;
    }
    
    // Obsługa przeciągania wierzchołka
    if (isDraggingVertex) {
      const { polygonIndex, vertexIndex, offsetX = 0, offsetY = 0 } = isDraggingVertex;
      
      // Uwzględniamy offset przy liczeniu nowej pozycji
      const newX = clientX - svgRect.left + offsetX;
      const newY = clientY - svgRect.top + offsetY;

      setModifiedPolygons((prev) => {
        const updated = [...prev];
        // Upewniamy się, że istnieje polygonIndex i vertexIndex
        if (updated[polygonIndex] && updated[polygonIndex].vertices[vertexIndex]) {
          const newPolygons = [...prev];
          newPolygons[polygonIndex] = {
            ...newPolygons[polygonIndex],
            vertices: [...newPolygons[polygonIndex].vertices]
          };
          newPolygons[polygonIndex].vertices[vertexIndex] = { x: newX, y: newY };
          return newPolygons;
        }
        return prev;
      });
      setHasEdited(true);
    }
    
    // Obsługa przeciągania wielokąta
    if (isDraggingPolygon) {
      const { polygonIndex, offsetX = 0, offsetY = 0 } = isDraggingPolygon;
      
      // Uwzględniamy offset przy liczeniu nowej pozycji środka
      const newCenterX = clientX - svgRect.left + offsetX;
      const newCenterY = clientY - svgRect.top + offsetY;
      
      // Obliczamy aktualny środek wielokąta
      const currentVertices = modifiedPolygons[polygonIndex].vertices;
      const currentCenterX = currentVertices.reduce((sum, v) => sum + v.x, 0) / currentVertices.length;
      const currentCenterY = currentVertices.reduce((sum, v) => sum + v.y, 0) / currentVertices.length;
      
      // Obliczamy przesunięcie
      const deltaX = newCenterX - currentCenterX;
      const deltaY = newCenterY - currentCenterY;
      
      setModifiedPolygons((prev) => {
        const updated = [...prev];
        if (updated[polygonIndex]) {
          const newPolygons = [...prev];
          newPolygons[polygonIndex] = {
            ...newPolygons[polygonIndex],
            vertices: newPolygons[polygonIndex].vertices.map(vertex => ({
              x: vertex.x + deltaX,
              y: vertex.y + deltaY
            }))
          };
          return newPolygons;
        }
        return prev;
      });
      setHasEdited(true);
    }
  }, [isDraggingVertex, isDraggingPolygon, developerMode, modifiedPolygons]);

  // Zakończenie przeciągania wierzchołka lub wielokąta
  const handleMouseUp = useCallback(() => {
    if (isDraggingVertex) {
      setIsDraggingVertex(null);
    }
    
    if (isDraggingPolygon) {
      setIsDraggingPolygon(null);
    }
    
    // Powiadomienie o zmianie pozycji - bez zapisu
    if (hasEdited) {
      setHasEdited(true);
    }
  }, [isDraggingVertex, isDraggingPolygon, hasEdited]);

  // Dodawanie i usuwanie globalnych event listenerów do obsługi przeciągania
  useEffect(() => {
    const handleMouseMoveFn = (e: MouseEvent) => handleMouseMove(e);
    const handleTouchMoveFn = (e: TouchEvent) => {
      // Zapobieganie domyślnemu scrollowaniu tylko podczas przeciągania
      if (isDraggingVertex || isDraggingPolygon) {
        e.preventDefault();
      }
      handleMouseMove(e);
    };
    const handleMouseUpFn = () => handleMouseUp();
    const handleTouchEndFn = () => handleMouseUp();
    
    // Dodaj nasłuchiwanie wydarzeń myszy i dotyku
    window.addEventListener('mousemove', handleMouseMoveFn);
    window.addEventListener('mouseup', handleMouseUpFn);
    window.addEventListener('touchmove', handleTouchMoveFn, { passive: false });
    window.addEventListener('touchend', handleTouchEndFn);
    
    // Funkcja czyszcząca
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveFn);
      window.removeEventListener('mouseup', handleMouseUpFn);
      window.removeEventListener('touchmove', handleTouchMoveFn);
      window.removeEventListener('touchend', handleTouchEndFn);
    };
  }, [handleMouseMove, handleMouseUp, isDraggingVertex, isDraggingPolygon]);

  // Cleanup timeout przy unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // Przywrócenie poprzedniej wersji i wyczyszczenie localStorage
  const restorePreviousVersion = useCallback(() => {
    setModifiedPolygons([...polygons]);
    setHasEdited(false);
    isInitializedRef.current = false;
    wasSavedDataLoadedRef.current = false;
    
    // Wyczyszczenie localStorage
    for (let i = 0; i < polygons.length + 1; i++) {
      localStorage.removeItem(`polygon_${i + 1}`);
    }
    localStorage.removeItem('polygonsCount');
    localStorage.removeItem('polygons_saved'); // Usuń flagę zapisanych danych
    
    toast.success("Zmiany zostały cofnięte i usunięte z pamięci", {
      position: "bottom-center",
      duration: 2000,
    });
  }, [polygons, setHasEdited, setModifiedPolygons]);

  // Funkcja do dodawania nowego wierzchołka między dwoma istniejącymi punktami
  const handleAddVertex = useCallback((polygonIndex: number, afterVertexIndex: number) => {
    setModifiedPolygons(prev => {
      const updated = [...prev];
      if (updated[polygonIndex]) {
        const vertices = updated[polygonIndex].vertices;
        const currentVertex = vertices[afterVertexIndex];
        const nextVertex = vertices[(afterVertexIndex + 1) % vertices.length]; // Cykliczne przejście
        
        // Oblicz środek między dwoma punktami
        const middleX = (currentVertex.x + nextVertex.x) / 2;
        const middleY = (currentVertex.y + nextVertex.y) / 2;
        
        // Wstaw nowy punkt po aktualnym punkcie
        const newVertices = [
          ...vertices.slice(0, afterVertexIndex + 1),
          { x: middleX, y: middleY },
          ...vertices.slice(afterVertexIndex + 1)
        ];
        
        updated[polygonIndex] = {
          ...updated[polygonIndex],
          vertices: newVertices
        };
      }
      return updated;
    });
    setHasEdited(true);
    toast.success(`Dodano nowy wierzchołek do wielokąta ${polygonIndex + 1}`);
  }, []);

  // Funkcja do usuwania wierzchołka
  const handleRemoveVertex = useCallback((polygonIndex: number, vertexIndex: number) => {
    setModifiedPolygons(prev => {
      const updated = [...prev];
      if (updated[polygonIndex] && updated[polygonIndex].vertices.length > 3) {
        updated[polygonIndex] = {
          ...updated[polygonIndex],
          vertices: updated[polygonIndex].vertices.filter((_, idx) => idx !== vertexIndex)
        };
        return updated;
      }
      toast.error("Wielokąt musi mieć co najmniej 3 wierzchołki");
      return prev;
    });
    setHasEdited(true);
  }, []);

  // Śledzenie pozycji kursora i dotyku
  const handleMouseMoveTooltip = (e: React.MouseEvent | React.TouchEvent) => {
    // Pozycja względem okna przeglądarki
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
    
    // Walidacja współrzędnych
    if (typeof clientX !== 'number' || typeof clientY !== 'number' || 
        !isFinite(clientX) || !isFinite(clientY)) {
      return;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    setMousePosition({ x, y });
  };
  
  // Obsługa kliknięcia i dotyku na mapie
  const handleMapClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Sprawdź, czy kliknięcie było na wielokącie czy poza nim
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
    
    // Walidacja współrzędnych - upewnij się, że są liczbami skończonymi
    if (typeof clientX !== 'number' || typeof clientY !== 'number' || 
        !isFinite(clientX) || !isFinite(clientY)) {
      return;
    }
    
    const element = document.elementFromPoint(clientX, clientY);
    
    // Sprawdź czy kliknięto poza wielokątami I poza tooltipem
    const isOverPolygon = element && (element.tagName === 'polygon' || element.closest('polygon'));
    const isOverTooltip = element && element.closest('[data-tooltip="true"]');
    
    if (!isOverPolygon && !isOverTooltip) {
      // Resetuj wszystkie tooltipki
      setActiveTooltips(Array(polygons.length).fill(false));
      // Na mobile resetuj też aktywny wielokąt i podświetlenie
      if (isMobile) {
        setMobileActivePolygon(null);
        setHighlightedPolygon(null); // Wyłącz podświetlenie
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
        }
      }
    }
  };
  
  // Włączanie tooltipów przy najechaniu
  // Funkcja pomocnicza do dławienia (throttling) dla lepszej wydajności
  const throttle = (func: Function, limit: number) => {
    let inThrottle = false;
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  };

  // Włączanie tooltipów przy najechaniu na wielokąt - z dławieniem (tylko desktop)
  const handleMouseEnterPolygon = throttle((index: number) => {
    // Na mobile nie używamy hover events
    if (isMobile) return;
    
    const newActiveTooltips = Array(polygons.length).fill(false);
    newActiveTooltips[index] = true;
    setActiveTooltips(newActiveTooltips);
    
    // Aktualizacja pozycji myszy dla tooltipa
    const mouseEvent = window.event as MouseEvent;
    if (mouseEvent) {
      setMousePosition({
        x: mouseEvent.clientX,
        y: mouseEvent.clientY
      });
    }
  }, 20);
  
  // Wyłączanie tooltipów przy opuszczeniu wielokąta - z dławieniem (tylko desktop)
  const handleMouseLeavePolygon = throttle((index: number) => {
    // Na mobile nie używamy hover events
    if (isMobile) return;
    
    const newActiveTooltips = [...activeTooltips];
    newActiveTooltips[index] = false;
    setActiveTooltips(newActiveTooltips);
  }, 20);
  
  // Obsługa kliknięcia w wielokąt na mobile - tylko pokazuje tooltip
  const handlePolygonClickMobile = (houseIndex: number, polygonIndex: number) => {
    const propertyUnit = propertyUnits[houseIndex];
    
    // Pozwalamy na kliknięcie dla wszystkich lokali oprócz sprzedanych i przeniesionych
    if (propertyUnit.status === 'sold-transferred') {
      toast.error("Ten lokal został już sprzedany", {
        position: "bottom-center",
        duration: 3000,
        style: {
          background: '#ff6b6b',
          color: '#fff',
          fontWeight: 'bold',
        }
      });
      return;
    }

    // Wyczyść timeout jeśli istnieje (z poprzedniego tooltipa)
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    
    // Ukryj wszystkie poprzednie tooltipki i pokaż nowy
    setMobileActivePolygon(polygonIndex);
    setHighlightedPolygon(polygonIndex); // Podświetl kliknięty polygon
    const newActiveTooltips = Array(polygons.length).fill(false);
    newActiveTooltips[polygonIndex] = true;
    setActiveTooltips(newActiveTooltips);
    
    // Ustaw pozycję tooltipa na środek ekranu (mobile)
    setMousePosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
    
    // Auto-hide po 10 sekundach na mobile
    tooltipTimeoutRef.current = setTimeout(() => {
      setActiveTooltips(Array(polygons.length).fill(false));
      setMobileActivePolygon(null);
      setHighlightedPolygon(null); // Wyłącz podświetlenie
    }, 10000);
  };

  // Obsługa kliknięcia w wielokąt na desktop - bezpośrednio do tabeli
  const handlePolygonClickDesktop = (houseIndex: number) => {
    const propertyUnit = propertyUnits[houseIndex];
    
    // Pozwalamy na kliknięcie dla wszystkich lokali oprócz sprzedanych i przeniesionych
    if (propertyUnit.status === 'sold-transferred') {
      toast.error("Ten lokal został już sprzedany", {
        position: "bottom-center",
        duration: 3000,
        style: {
          background: '#ff6b6b',
          color: '#fff',
          fontWeight: 'bold',
        }
      });
      return;
    }
    
    // Najpierw usuń wszystkie poprzednie podświetlenia
    document.querySelectorAll('tr.highlighted-row').forEach(row => {
      row.classList.remove('highlighted-row');
      // Przywróć domyślny wygląd wiersza
      (row as HTMLElement).style.backgroundColor = '';
      (row as HTMLElement).style.boxShadow = '';
      (row as HTMLElement).style.color = '';
      (row as HTMLElement).style.position = '';
      (row as HTMLElement).style.zIndex = '';
      
      // Przywróć domyślny wygląd komórek
      const cells = row.querySelectorAll('td');
      cells.forEach((cell) => {
        (cell as HTMLElement).style.backgroundColor = '';
        (cell as HTMLElement).style.color = '';
        (cell as HTMLElement).style.fontWeight = '';
      });
    });
    
    // Przewijanie do odpowiedniego wiersza w tabeli
    // Próbujemy znaleźć wiersz na dwa sposoby - po atrybucie data-unit-id lub po id
    const buildingNumber = propertyUnit.buildingNumber;
    const unitNumber = propertyUnit.unitNumber;
    
    // Najpierw próbujemy po data-unit-id (z escapowaniem znaków specjalnych)
    const unitId = `${buildingNumber}-${unitNumber}`.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
    let unitRow = document.querySelector(`tr[data-unit-id="${unitId}"]`);
    
    // Jeśli nie znaleziono, próbujemy po id
    if (!unitRow) {
      unitRow = document.getElementById(`unit-row-${buildingNumber}${unitNumber}`);
    }
    
    if (unitRow) {
      // Przewijamy do wiersza
      unitRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Dodaj klasę do identyfikacji podświetlonego wiersza
      unitRow.classList.add('highlighted-row');
      
      // Dodaj wyraźne podświetlenie całego wiersza
      (unitRow as HTMLElement).style.transition = 'all 0.3s ease-in-out';
      (unitRow as HTMLElement).style.backgroundColor = '#d7c28d';
      (unitRow as HTMLElement).style.color = '#000000';
      
      // Dodaj efekt pulsowania dla lepszej widoczności
      const pulseEffect = () => {
        // Zabezpieczenie przed null
        if (!unitRow) return;
        
        (unitRow as HTMLElement).style.backgroundColor = '#e6d7b3'; // Jaśniejszy kolor
        
        setTimeout(() => {
          // Dodatkowe zabezpieczenie przed null
          if (unitRow && unitRow.classList.contains('highlighted-row')) {
            (unitRow as HTMLElement).style.backgroundColor = '#d7c28d'; // Powrót do podstawowego koloru
          }
        }, 500);
      };
      
      // Wywołaj efekt pulsowania kilka razy
      for (let i = 0; i < 3; i++) {
        setTimeout(() => pulseEffect(), i * 1000);
      }
      
      // Dodaj obramowanie i cień dla lepszej widoczności
      (unitRow as HTMLElement).style.boxShadow = '0 0 15px rgba(215, 194, 141, 0.9), inset 0 0 0 2px #c3aa69';
      (unitRow as HTMLElement).style.position = 'relative';
      (unitRow as HTMLElement).style.zIndex = '10';
      
      // Zabezpieczenie przed null
      if (!unitRow) return;
      
      // Ustaw wszystkie komórki w wierszu na ten sam kolor tła
      const cells = unitRow.querySelectorAll('td');
      cells.forEach((cell) => {
        (cell as HTMLElement).style.backgroundColor = '#d7c28d';
        (cell as HTMLElement).style.color = '#000000';
        (cell as HTMLElement).style.fontWeight = 'bold';
      });
      
      // Po 2 sekundach całkowicie usuń podświetlenie
      setTimeout(() => {
        if (unitRow && unitRow.classList.contains('highlighted-row')) {
          // Usuń klasę highlighted-row
          unitRow.classList.remove('highlighted-row');
          
          // Całkowicie zresetuj wszystkie style wiersza
          (unitRow as HTMLElement).style.transition = '';
          (unitRow as HTMLElement).style.boxShadow = '';
          (unitRow as HTMLElement).style.zIndex = '';
          (unitRow as HTMLElement).style.backgroundColor = '';
          (unitRow as HTMLElement).style.color = '';
          (unitRow as HTMLElement).style.position = '';
          
          // Całkowicie zresetuj wszystkie style komórek
          cells.forEach((cell) => {
            (cell as HTMLElement).style.transition = '';
            (cell as HTMLElement).style.backgroundColor = '';
            (cell as HTMLElement).style.color = '';
            (cell as HTMLElement).style.fontWeight = '';
          });
        }
      }, 2000);
      
      // Podświetlenie będzie aktywne tylko przez 2 sekundy, potem automatycznie zniknie
    } else {
      // Jeśli nie znaleziono wiersza, pokaż komunikat
      toast(`Lokal ${propertyUnit.buildingNumber}${propertyUnit.unitNumber}: ${propertyUnit.status === 'reserved' ? 'Zarezerwowany' : 'Dostępny'}`, {
        position: "bottom-center",
        duration: 3000,
      });
    }
  };

  // Funkcja do kopiowania koordynatów do schowka
  const handleCopyCoordinates = () => {
    // Przygotowanie danych
    const coordinateData = modifiedPolygons.map(polygon => 
      polygon.vertices.map(v => ({ x: Math.round(v.x), y: Math.round(v.y) }))
    );

    // Kopiowanie do schowka
    const success = copyPolygonCoordinates(coordinateData);
    
    // Aktualizacja stanu
    setIsCopySuccess(success);
    // Resetowanie stanu po 2 sekundach
    setTimeout(() => setIsCopySuccess(false), 2000);
  };

  // Funkcja do zapisywania zmian w localStorage i API
  const handleSaveChanges = useCallback(async () => {
    try {
      const verticesArray = modifiedPolygons.map(p => p.vertices);
      const success = await savePolygonsToLocalStorage(verticesArray, propertyUnits);
      
      if (success) {
        setIsSaveSuccess(true);
        setTimeout(() => setIsSaveSuccess(false), 2000);
        
        toast.success("Zmiany zostały zapisane do bazy danych", {
          position: "bottom-center",
          duration: 2000,
        });
      } else {
        toast.error("Nie udało się zapisać zmian", {
          position: "bottom-center",
          duration: 2000,
        });
      }
      
      return success;
    } catch (error) {
      console.error('Błąd podczas zapisywania wielokątów:', error);
      toast.error("Wystąpił błąd podczas zapisywania", {
        position: "bottom-center",
        duration: 2000,
      });
      return false;
    }
  }, [modifiedPolygons, propertyUnits]);

  // Funkcja do obsługi kliknięcia w tooltip na mobile
  const handleTooltipClick = (houseIndex: number) => {
    if (isMobile) {
      // Ukryj tooltip i podświetlenie
      setActiveTooltips(Array(polygons.length).fill(false));
      setMobileActivePolygon(null);
      setHighlightedPolygon(null); // Wyłącz podświetlenie
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      
      // Przejdź do tabeli używając funkcji desktop
      handlePolygonClickDesktop(houseIndex);
    }
  };

  // Obsługa kliknięcia w całym kontenerze (poza mapą)
  const handleContainerClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Sprawdź czy kliknięto w sam kontener (nie w dzieci)
    if (e.target === e.currentTarget) {
      // Kliknięto poza mapą - wyłącz tooltipki i podświetlenie
      setActiveTooltips(Array(polygons.length).fill(false));
      if (isMobile) {
        setMobileActivePolygon(null);
        setHighlightedPolygon(null); // Wyłącz podświetlenie
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
        }
      }
    }
  };

  return (
    <div 
      className="relative w-full" 
      ref={mapRef}
      onClick={handleContainerClick}
      onTouchEnd={handleContainerClick}
    >
      <div 
        className="relative w-full" 
        onMouseMove={handleMouseMoveTooltip} 
        onTouchMove={(e) => {
          // Nie blokuj scrollowania, pozwól na normale przewijanie strony
          handleMouseMoveTooltip(e);
        }}
        onClick={handleMapClick}
        onTouchEnd={handleMapClick}
      >
        {/* Obrazek mapy */}
        <div className="overflow-hidden shadow-xl relative">
          <Image
            src={require('@/lib/assets').ASSET_PATHS.photos.image24}
            alt="Wizualizacja Zamoyskiego 2"
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
          />
          
          {/* Interaktywna mapa - obsługuje zarówno desktop jak i mobile */}
          <svg 
            id="map-svg"
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 1200 600" 
            preserveAspectRatio="none"
            style={{ 
              pointerEvents: 'all', 
              touchAction: developerMode ? 'none' : 'auto',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
            onMouseLeave={() => setActiveTooltips(Array(polygons.length).fill(false))}
          >
            {/* Definicja filtrów SVG */}
            <defs>
              {/* Filtr do wygładzania krawędzi - duży feather */}
              <filter id="feather" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                <feComposite in="blur" in2="SourceGraphic" operator="atop" result="featheredEdges" />
              </filter>
              
              {/* Bardzo duży feather specjalnie dla wielokątów */}
              <filter id="bigFeather" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="bigBlur" />
                <feComposite in="bigBlur" in2="SourceGraphic" operator="atop" result="softEdges" />
              </filter>
              
              {/* Ekstremalnie miękki feather */}
              <filter id="ultraSoftFeather" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="50" result="ultraBlur" />
                <feComposite in="ultraBlur" in2="SourceGraphic" operator="atop" result="ultraSoftEdges" />
              </filter>
              
              {/* Podwójny feather - na krawędzie i na wypełnienie */}
              <filter id="doubleFeather" x="-200%" y="-200%" width="500%" height="500%">
                {/* Pierwszy blur dla krawędzi */}
                <feGaussianBlur in="SourceGraphic" stdDeviation="50" result="edgeBlur" />
                {/* Drugi blur dla wypełnienia - mniejszy */}
                <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="fillBlur" />
                {/* Połączenie obydwu efektów */}
                <feComposite in="fillBlur" in2="edgeBlur" operator="screen" result="combinedBlur" />
                <feComposite in="combinedBlur" in2="SourceGraphic" operator="atop" result="doubleFeathered" />
              </filter>
              
              {/* Miękkie wypełnienie tylko dla wnętrza */}
              <filter id="softFill" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="softFillBlur" />
                <feComposite in="softFillBlur" in2="SourceGraphic" operator="over" result="softFilled" />
              </filter>
              
              {/* Rozmyte obramowanie dla linii */}
              <filter id="blurredStroke" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blurredEdge" />
              </filter>
              
              <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feFlood floodColor="rgb(34, 197, 94)" floodOpacity="0.7" result="glow" />
                <feComposite in="glow" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                  <feMergeNode in="softGlow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              
              <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feFlood floodColor="rgb(249, 115, 22)" floodOpacity="0.7" result="glow" />
                <feComposite in="glow" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                  <feMergeNode in="softGlow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              
              <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feFlood floodColor="rgb(239, 68, 68)" floodOpacity="0.7" result="glow" />
                <feComposite in="glow" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                  <feMergeNode in="softGlow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feFlood floodColor="rgb(215, 194, 141)" floodOpacity="0.7" result="glow" />
                <feComposite in="glow" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                  <feMergeNode in="softGlow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              
              <filter id="grayGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feFlood floodColor="rgb(107, 114, 128)" floodOpacity="0.7" result="glow" />
                <feComposite in="glow" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                  <feMergeNode in="softGlow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Nakładki wielokątów */}
            {modifiedPolygons.map((polygon, polygonIndex) => (
              <PolygonOverlay
                key={polygonIndex}
                vertices={polygon.vertices}
                polygonIndex={polygonIndex}
                developerMode={developerMode}
                isVisible={!developerMode || areasVisibility[polygonIndex]}
                isDraggingVertex={isDraggingVertex}
                isDraggingPolygon={isDraggingPolygon}
                polygonStyle={polygonStyle}
                status={propertyUnits[polygon.houseIndex].status}
                onMouseEnter={() => handleMouseEnterPolygon(polygonIndex)}
                onMouseLeave={() => handleMouseLeavePolygon(polygonIndex)}
                onClick={() => isMobile 
                  ? handlePolygonClickMobile(polygon.houseIndex, polygonIndex)
                  : handlePolygonClickDesktop(polygon.houseIndex)
                }
                isMobile={isMobile}
                isHighlighted={highlightedPolygon === polygonIndex}
                onVertexMouseDown={(e, vertexIndex, polygonIndex) => handleVertexMouseDown(e, vertexIndex, polygonIndex)}
                onPolygonMouseDown={(e, polygonIndex) => handlePolygonMouseDown(e, polygonIndex)}
                onAddVertex={handleAddVertex}
              />
            ))}
          </svg>
        </div>
        
        {/* Tooltipki dla wielokątów - responsive dla wszystkich urządzeń */}
        {modifiedPolygons.map((polygon, index) => (
          activeTooltips[index] && (
            <MapTooltip
              key={index}
              propertyUnit={propertyUnits[polygon.houseIndex]}
              mousePosition={mousePosition}
              isMobile={isMobile}
              onTooltipClick={() => handleTooltipClick(polygon.houseIndex)}
            />
          )
        ))}
      </div>
      
      {/* Panel deweloperski - tylko na desktopie */}
      {developerMode && !isMobile && (
        <div className="absolute top-0 right-0 z-20">
          <DeveloperPanel
            isOpen={isDevPanelOpen}
            onClose={() => setIsDevPanelOpen(!isDevPanelOpen)}
            onCopyCoordinates={handleCopyCoordinates}
            onSaveChanges={handleSaveChanges}
            onRestorePreviousVersion={restorePreviousVersion}
            areasVisibility={areasVisibility}
            toggleAreaVisibility={toggleAreaVisibility}
            showAllAreas={showAllAreas}
            hideAllAreas={hideAllAreas}
            isCopySuccess={isCopySuccess}
            isSaveSuccess={isSaveSuccess}
            polygons={modifiedPolygons}
            propertyUnits={propertyUnits}
            onAddVertex={handleAddVertex}
            onRemoveVertex={handleRemoveVertex}
          />
        </div>
      )}
    </div>  
  );
};

export default InteractiveMap;