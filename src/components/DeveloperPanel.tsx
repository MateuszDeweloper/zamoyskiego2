"use client";

import React, { useState } from 'react';
import { Vertex } from '@/data/propertyUnits';
// Importujemy bibliotekę toast
import toast from 'react-hot-toast';

interface DeveloperPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyCoordinates: () => void;
  onSaveChanges: () => void;
  onRestorePreviousVersion: () => void;
  areasVisibility: boolean[];
  toggleAreaVisibility: (index: number) => void;
  showAllAreas: () => void;
  hideAllAreas: () => void;
  isCopySuccess: boolean;
  isSaveSuccess: boolean;
  polygons: {
    vertices: Vertex[];
    houseIndex: number;
    buildingNumber: string | number;
    unitNumber: string | number;
  }[];
  propertyUnits: any[];
  onAddVertex?: (polygonIndex: number, afterVertexIndex: number) => void;
  onRemoveVertex?: (polygonIndex: number, vertexIndex: number) => void;
}

const DeveloperPanel: React.FC<DeveloperPanelProps> = ({
  isOpen,
  onClose,
  onCopyCoordinates,
  onSaveChanges,
  onRestorePreviousVersion,
  areasVisibility,
  toggleAreaVisibility,
  showAllAreas,
  hideAllAreas,
  isCopySuccess,
  isSaveSuccess,
  polygons,
  propertyUnits,
  onAddVertex,
  onRemoveVertex
}) => {
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState<number | null>(null);
  const [newVertexX, setNewVertexX] = useState<string>('');
  const [newVertexY, setNewVertexY] = useState<string>('');
  const [showAddVertexForm, setShowAddVertexForm] = useState<boolean>(false);

  // Obsługa dodawania nowego wierzchołka (teraz tylko dla ręcznego wprowadzania)
  const handleManualAddVertex = () => {
    if (selectedPolygonIndex !== null && newVertexX && newVertexY && onAddVertex) {
      const x = parseInt(newVertexX);
      const y = parseInt(newVertexY);
      if (!isNaN(x) && !isNaN(y)) {
        console.log(`Ręczne dodawanie wierzchołka: wielokąt ${selectedPolygonIndex}, x=${x}, y=${y}`);
        // Dla ręcznego dodawania, dodajemy na końcu (afterVertexIndex = ostatni indeks)
        const lastVertexIndex = polygons[selectedPolygonIndex].vertices.length - 1;
        onAddVertex(selectedPolygonIndex, lastVertexIndex);
        
        // Następnie ręcznie ustawiamy współrzędne nowego punktu
        // To wymaga dodatkowej funkcji lub modyfikacji istniejącej
        
        setNewVertexX('');
        setNewVertexY('');
        setShowAddVertexForm(false);
        console.log('Wierzchołek dodany, formularz zamknięty');
      } else {
        console.error('Nieprawidłowe wartości współrzędnych:', newVertexX, newVertexY);
      }
    } else {
      console.error('Brakujące dane do dodania wierzchołka:', { 
        selectedPolygonIndex, 
        newVertexX, 
        newVertexY, 
        hasOnAddVertex: !!onAddVertex 
      });
    }
  };

  // Funkcja czyszcząca localStorage
  const clearStoredData = () => {
    for (let i = 1; i <= 30; i++) { // Czyścimy więcej kluczy na wypadek dodatkowych wielokątów
      localStorage.removeItem(`polygon_${i}`);
    }
    localStorage.removeItem('polygonsCount');
    localStorage.removeItem('polygons_saved');
    
    toast.success("Wyczyszczono wszystkie zapisane dane z pamięci przeglądarki", {
      position: "bottom-center",
      duration: 3000,
    });
    
    // Odświeżenie strony po wyczyszczeniu
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={onClose}
        className="bg-gray-900/90 border-2 border-[#d7c28d] text-[#d7c28d] p-2 rounded-bl-lg shadow-lg flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
        <span>Panel deweloperski</span>
      </button>
    );
  }

  return (
    <div className="bg-gray-900/95 border-4 border-[#d7c28d] p-5 text-gray-100 w-[350px] max-h-[700px] overflow-y-auto shadow-2xl">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={onClose}
      >
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#d7c28d]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
          <h3 className="font-bold text-[#d7c28d] text-xl">Panel deweloperski</h3>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#d7c28d] cursor-pointer">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div className="mt-4 flex gap-2 flex-wrap">
        <button
          onClick={onCopyCoordinates}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
          </svg>
          Kopiuj kod
        </button>
        <button
          onClick={onSaveChanges}
          className="bg-purple-700 hover:bg-purple-800 text-white text-sm py-1 px-3 rounded flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          ZAPISZ ZMIANY
        </button>
        <button
          onClick={onRestorePreviousVersion}
          className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          Cofnij zmiany
        </button>
      </div>
      
      <div className="mt-4 flex gap-2 flex-wrap">
        <button
          onClick={showAllAreas}
          className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-2 rounded flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Pokaż wszystkie
        </button>
        <button
          onClick={hideAllAreas}
          className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-2 rounded flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
          Ukryj wszystkie
        </button>
        <button
          onClick={clearStoredData}
          className="bg-orange-600 hover:bg-orange-700 text-white text-sm py-1 px-2 rounded flex items-center gap-1"
          title="Wyczyść wszystkie zapisane dane z pamięci przeglądarki"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Wyczyść dane
        </button>
      </div>
      
      {isCopySuccess && (
        <div className="mt-2 text-xs bg-blue-900/60 p-1 rounded text-blue-200">
          ✓ Współrzędne skopiowane do schowka
        </div>
      )}
      
      {isSaveSuccess && (
        <div className="mt-2 text-xs bg-purple-900/60 p-1 rounded text-purple-200">
          ✓ Zmiany zostały zapisane
        </div>
      )}
      
      {/* Informacja o dodawaniu punktów */}
      <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-600/30">
        <p className="text-xs text-blue-200 mb-1">
          💡 <strong>Jak dodawać punkty:</strong>
        </p>
        <p className="text-xs text-blue-300">
          Kliknij zielony przycisk <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span> <strong>+</strong> na mapie między punktami wielokąta, aby dodać nowy punkt w tym miejscu.
        </p>
      </div>
      
      <div className="mt-4 divide-y divide-gray-700">
        {polygons.map((polygon, index) => (
          <div key={index} className="py-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-green-300 mb-2">
                Wielokąt {index + 1} - {propertyUnits[polygon.houseIndex].buildingNumber}{propertyUnits[polygon.houseIndex].unitNumber}
              </h4>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => toggleAreaVisibility(index)}
                  className={`text-sm p-1 rounded-full ${areasVisibility[index] ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                  title={areasVisibility[index] ? 'Kliknij, aby ukryć obszar' : 'Kliknij, aby pokazać obszar'}
                >
                  {areasVisibility[index] ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1 text-xs">
              {polygon.vertices.map((vertex, vIndex) => (
                <div key={vIndex} className="bg-gray-800 p-1 rounded group relative">
                  <span className="text-gray-400">v{vIndex}: </span>
                  <span className="text-white">
                    {Math.round(vertex.x)}, {Math.round(vertex.y)}
                  </span>
                  {onRemoveVertex && polygon.vertices.length > 3 && (
                    <button
                      onClick={() => onRemoveVertex(index, vIndex)}
                      className="absolute right-0 top-0 -mt-2 -mr-2 bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Usuń punkt"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperPanel;