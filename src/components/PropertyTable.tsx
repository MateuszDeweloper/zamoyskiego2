"use client";

import React, { useState, useEffect } from 'react';
import { PropertyUnit } from '@/data/propertyUnits';
import Link from 'next/link';
import { HiOutlineClock } from 'react-icons/hi';
import PriceHistoryModal from './PriceHistoryModal';

interface PropertyTableProps {
  propertyUnits: PropertyUnit[];
}

const PropertyTable: React.FC<PropertyTableProps> = ({ propertyUnits }) => {
  const [filteredUnits, setFilteredUnits] = useState<PropertyUnit[]>(propertyUnits);
  const [activeTab, setActiveTab] = useState<string>('available');
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<{
    buildingNumber: string | number;
    unitNumber: string | number;
    area: number;
  } | null>(null);

  // Formatowanie ceny
  const formatPrice = (price: number) => {
    return price.toLocaleString() + ' zł';
  };

  // Formatowanie ceny za m²
  const formatPricePerM2 = (pricePerM2: number) => {
    return pricePerM2.toLocaleString() + ' zł';
  };

  // Sortowanie jednostek
  const sortUnits = (units: PropertyUnit[]) => {
    return [...units].sort((a, b) => {
      // Najpierw sortuj według numeru budynku
      if (a.buildingNumber !== b.buildingNumber) {
        return Number(a.buildingNumber) - Number(b.buildingNumber);
      }
      // Następnie sortuj według numeru lokalu
      return String(a.unitNumber).localeCompare(String(b.unitNumber), undefined, { numeric: true });
    });
  };

  useEffect(() => {
    setFilteredUnits(
      activeTab === 'available' 
        ? propertyUnits.filter(unit => unit.status === 'available' || unit.status === 'reserved' || unit.status === 'sold-not-transferred')
        : propertyUnits
    );
  }, [propertyUnits, activeTab]);

  // Otwieranie modala z historią cen
  const openPriceHistoryModal = (buildingNumber: string | number, unitNumber: string | number, area: number) => {
    setSelectedUnit({ buildingNumber, unitNumber, area });
    setModalOpen(true);
  };

  // Zamykanie modala
  const closePriceHistoryModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold mb-2">Dostępne lokale</h3>
          <p className="text-gray-600">Sprawdź dostępność i ceny naszych lokali</p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === 'available' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
                onClick={() => setActiveTab('available')}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Dostępne lokale
                </span>
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === 'all' 
                    ? 'bg-[#d7c28d] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('all')}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Wszystkie lokale
                </span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-h-[400px]">
              <table className="w-full text-sm min-w-[1000px]">
                <thead>
                  <tr className="bg-[#d7c28d] text-black">
                    <th className="px-4 py-3 text-left font-semibold text-sm">Budynek/Lok.</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Metraż (m²)</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Piętro</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Cena</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Cena/m²</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Pom. przyn.</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Akcje</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d7c28d]"></div>
                          <span className="ml-3">Ładowanie danych...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUnits.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        Brak dostępnych domów
                      </td>
                    </tr>
                  ) : (
                    sortUnits(filteredUnits).map((unit, index) => (
                      <tr
                        key={index}
                        data-unit-id={`${unit.buildingNumber}-${unit.unitNumber}`}
                        id={`unit-row-${unit.buildingNumber}${unit.unitNumber}`}
                        className={`hover:bg-gray-50 transition-colors duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } relative`}
                      >
                        <td className="px-4 py-3 font-medium text-gray-900 text-left">{unit.buildingNumber}{unit.unitNumber}</td>
                        <td className="px-4 py-3 text-gray-700 text-left">{unit.area.toFixed(2)} m²</td>
                        <td className="px-4 py-3 text-gray-700 text-left">
                          {unit.floor === 'parter' ? 'Parter' : 
                           unit.floor === 'piętro' ? 'Piętro' : 
                           unit.floor === 'piętro + ogródek' ? 'Piętro + ogródek' :
                           unit.floor}
                        </td>
                        <td className="px-4 py-3 font-bold text-[#d7c28d] text-left">
                          {unit.status === 'sold-transferred' ? 'SPRZEDANE' : formatPrice(unit.price)}
                        </td>
                        <td className="px-4 py-3 text-gray-700 text-left">
                          {unit.status === 'sold-transferred' ? 'SPRZEDANE' : formatPricePerM2(unit.pricePerM2)}/m²
                        </td>
                        <td className="px-4 py-3 text-gray-700 capitalize text-left">
                          {unit.auxiliaryRooms || (unit.floor && unit.floor.includes('ogródek') ? 'Ogródek' : '-')}
                        </td>
                        <td className="px-4 py-3 text-left">
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-1">
                              {unit.status === 'sold-transferred' ? (
                                <div className="flex items-center justify-center w-[120px] h-[40px] px-2 py-1 rounded border border-gray-200 text-gray-400 cursor-not-allowed text-xs font-medium bg-gray-50">
                                  <HiOutlineClock className="w-3 h-3 mr-1 flex-shrink-0" />
                                  <span className="text-center">Historia cen</span>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => openPriceHistoryModal(unit.buildingNumber, unit.unitNumber, unit.area)}
                                  className="flex items-center justify-center w-[120px] h-[40px] px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-[#d7c28d] hover:text-white hover:border-[#d7c28d] transition-all duration-200 text-xs font-medium group cursor-pointer"
                                >
                                  <HiOutlineClock className="w-3 h-3 mr-1 flex-shrink-0 group-hover:text-white" />
                                  <span className="text-center group-hover:text-white">Historia cen</span>
                                </button>
                              )}
                              {unit.status === 'sold-transferred' ? (
                                <span className="inline-flex items-center justify-center w-[120px] h-[40px] px-2 py-1 rounded border border-gray-200 text-gray-400 cursor-not-allowed text-xs font-medium bg-gray-50">
                                  Rzut lokalu
                                </span>
                              ) : (
                                <Link 
                                  href={require('@/lib/assets').getRzutUrl(unit.buildingNumber, unit.unitNumber)}
                                  target="_blank"
                                  className="inline-flex items-center justify-center w-[120px] h-[40px] px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-[#d7c28d] hover:text-white hover:border-[#d7c28d] transition-all duration-200 text-xs font-medium group"
                                >
                                  <span className="group-hover:text-white">Rzut lokalu</span>
                                </Link>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-left">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                            unit.status === 'available' 
                              ? 'bg-green-600 text-white'
                              : unit.status === 'reserved'
                                ? 'bg-orange-600 text-white'
                              : unit.status === 'sold-transferred' || unit.status === 'sold-not-transferred'
                                ? 'bg-red-600 text-white'
                                : 'bg-yellow-600 text-white'
                          }`}>
                            {unit.status === 'available' 
                              ? 'Dostępne' 
                              : unit.status === 'reserved'
                                ? 'Rezerwacja'
                              : unit.status === 'sold-transferred' || unit.status === 'sold-not-transferred'
                                ? 'Sprzedane'
                                : 'Niedostępne'
                            }
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal historii cen */}
      {selectedUnit && (
        <PriceHistoryModal
          isOpen={modalOpen}
          onClose={closePriceHistoryModal}
          investment="zamoyskiego-2"
          buildingNumber={selectedUnit.buildingNumber}
          unitNumber={selectedUnit.unitNumber}
          area={selectedUnit.area}
        />
      )}
    </>
  );
};

export default PropertyTable;