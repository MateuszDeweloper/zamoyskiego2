"use client";

import React, { useState, useEffect } from 'react';
import InteractiveMap from '@/components/InteractiveMap';
import PropertyTable from '@/components/PropertyTable';
import { mapPropertyUnitsToPolygons } from '@/data/propertyUnits';
import Link from 'next/link';
import { ASSET_PATHS } from '@/lib/assets';

interface PropertyUnit {
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

const PropertiesSection = () => {
  const [propertyUnits, setPropertyUnits] = useState<PropertyUnit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProspektUrl, setActiveProspektUrl] = useState<string>(ASSET_PATHS.prospekt);
  const [hasActiveProspekt, setHasActiveProspekt] = useState<boolean>(false);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/houses');
        
        if (!response.ok) {
          throw new Error('Błąd podczas pobierania danych');
        }
        
        const data = await response.json();
        setPropertyUnits(data.houses || []);
      } catch (err) {
        setError('Nie udało się pobrać danych. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    };

    const fetchActiveProspekt = async () => {
      try {
        const response = await fetch('/api/prospekt?investment=zamoyskiego-2&active=true');
        if (response.ok) {
          const data = await response.json();
          if (data.prospekty && data.prospekty.length > 0) {
            setActiveProspektUrl(data.prospekty[0].fileUrl);
            setHasActiveProspekt(true);
          } else {
            setHasActiveProspekt(false);
          }
        } else {
          setHasActiveProspekt(false);
        }
      } catch (err) {
        console.error('Błąd podczas pobierania aktywnego prospektu:', err);
        setHasActiveProspekt(false);
      }
    };

    fetchHouses();
    fetchActiveProspekt();
  }, []);

  // Definiowanie typu dla polygonów
  interface Polygon {
    vertices: { x: number; y: number }[];
    houseIndex: number;
    buildingNumber: string | number;
    unitNumber: string | number;
    status?: string;
    isAvailable: boolean;
  }

  // Mapowanie danych do formatu wymaganego przez mapę
  let polygons: Polygon[] = [];
  try {
    console.log('PropertiesSection - próba mapowania propertyUnits:', propertyUnits);
    polygons = propertyUnits.length > 0 ? mapPropertyUnitsToPolygons(propertyUnits) : [];
    console.log('PropertiesSection - zmapowane polygony:', polygons);
  } catch (err) {
    console.error('PropertiesSection - błąd podczas mapowania polygonów:', err);
    setError('Wystąpił błąd podczas przetwarzania danych mapy.');
  }

  return (
    <section id="wybierz-dom" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Wybierz swój wymarzony dom
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
            Odkryj nowoczesne domy w zabudowie bliźniaczej w prestiżowej lokalizacji Stalowej Woli. 
            Każdy dom oferuje wysokiej jakości wykończenie, funkcjonalny układ oraz prywatne ogródki.
          </p>
          
          
          {/* Instrukcja dla użytkowników desktop */}
          <div className="hidden md:block bg-[#d7c28d]/10 border border-[#d7c28d]/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-[#8b7355]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                Najedź myszą na domy na mapie, aby zobaczyć szczegóły. Kliknij, aby przejść do tabeli.
              </span>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d7c28d]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-4 bg-red-100 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-12">
              <InteractiveMap 
                propertyUnits={propertyUnits}
                polygons={polygons as any}
              />
            </div>
            
            <div className="mb-12">
              <PropertyTable propertyUnits={propertyUnits} />
            </div>
            
            <div className="text-center mt-8">
              {hasActiveProspekt ? (
                <Link 
                  href={activeProspektUrl}
                  target="_blank"
                  className="inline-block bg-[#d7c28d] hover:bg-[#b09c5f] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 cursor-pointer"
                >
                  Pobierz prospekt informacyjny (część ogólna) (PDF)
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-block bg-gray-400 text-gray-600 font-semibold py-3 px-6 rounded-lg cursor-not-allowed opacity-60"
                  title="Prospekt informacyjny nie jest obecnie dostępny"
                >
                  Pobierz prospekt informacyjny (część ogólna) (PDF)
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PropertiesSection;