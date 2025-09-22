"use client";

import React from 'react';
import { PropertyUnit } from '@/data/propertyUnits';

interface MapTooltipProps {
  propertyUnit: PropertyUnit;
  mousePosition: { x: number; y: number };
  isMobile?: boolean;
  onTooltipClick?: () => void;
}

const MapTooltip: React.FC<MapTooltipProps> = ({ propertyUnit, mousePosition, isMobile = false, onTooltipClick }) => {
  const statusText = {
    'available': 'Dostępny',
    'unavailable': 'Niedostępny',
    'sold-transferred': 'Sprzedany',
    'sold-not-transferred': 'Sprzedany (w trakcie przeniesienia)',
    'reserved': 'Zarezerwowany'
  };

  // Pozycjonowanie responsywne - na mobile tooltip jest wycentrowany na dole
  const tooltipStyle = isMobile 
    ? {
        left: '50%',
        bottom: '20px',
        transform: 'translateX(-50%)',
        maxWidth: 'calc(100vw - 40px)',
        position: 'fixed' as const
      }
    : {
        left: `${mousePosition.x + 15}px`,
        top: `${mousePosition.y - 15}px`,
        maxWidth: '300px',
        transform: 'translateY(-100%)'
      };

  return (
    <div 
      className={`absolute z-50 bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#d7c28d] p-3 rounded-md ${isMobile ? 'text-base cursor-pointer' : 'text-sm'}`}
      style={tooltipStyle}
      data-tooltip="true"
      onClick={isMobile ? (e) => {
        e.preventDefault();
        e.stopPropagation(); // Zapobieganie propagacji do handleMapClick
        onTooltipClick?.();
      } : undefined}
      onTouchEnd={isMobile ? (e) => {
        e.preventDefault();
        e.stopPropagation();
        onTooltipClick?.();
      } : undefined}
    >
      <h4 className="font-bold text-lg text-[#d7c28d]">
        Dom {propertyUnit.buildingNumber}{propertyUnit.unitNumber}
      </h4>
      <div className="space-y-2 mt-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium px-2 py-1 rounded text-xs ${propertyUnit.status === 'available' ? 'bg-green-100 text-green-700' : propertyUnit.status === 'reserved' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
            {statusText[propertyUnit.status || 'available']}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Piętro:</span>
          <span className="font-medium">
            {propertyUnit.floor === 'parter' ? 'Parter' : 
             propertyUnit.floor === 'piętro' ? 'Piętro' : 
             propertyUnit.floor === 'piętro + ogródek' ? 'Piętro + ogródek' :
             propertyUnit.floor}
          </span>
        </div>
        
        {/* Dodaj pomieszczenia przynależne jeśli są */}
        {propertyUnit.floor && propertyUnit.floor.includes('ogródek') && (
          <div className="flex justify-between">
            <span className="text-gray-600">Pomieszczenia przynależne:</span>
            <span className="font-medium text-green-600">Ogródek</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-600">Powierzchnia:</span>
          <span className="font-medium">{propertyUnit.area} m²</span>
        </div>
        
        {propertyUnit.status !== 'sold-transferred' && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Cena:</span>
              <span className="font-medium text-[#d7c28d]">{propertyUnit.price.toLocaleString()} zł</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Cena za m²:</span>
              <span className="font-medium">{Math.round(propertyUnit.price / propertyUnit.area).toLocaleString()} zł/m²</span>
            </div>
          </>
        )}
      </div>
      <div className="mt-3 text-center">
        <span className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-500`}>
          {isMobile ? 'Dotknij, aby zobaczyć więcej szczegółów' : 'Kliknij, aby zobaczyć więcej szczegółów'}
        </span>
        {isMobile && (
          <div className="mt-1">
            <span className="text-xs text-gray-400">Dotknij ponownie, aby przejść do tabeli</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapTooltip;
