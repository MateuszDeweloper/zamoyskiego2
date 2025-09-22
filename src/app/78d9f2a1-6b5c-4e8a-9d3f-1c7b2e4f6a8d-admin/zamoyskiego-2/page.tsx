"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineHome, HiOutlinePencil, HiOutlineClock, HiOutlineCheck, HiOutlineX, HiOutlineDocumentText } from 'react-icons/hi';
import Link from 'next/link';
import ProspektModal from '@/app/components/ProspektModal';

interface House {
  _id?: string;
  buildingNumber: string | number;
  unitNumber: string | number;
  area: number;
  price: number;
  pricePerM2: number;
  auxiliaryRooms?: string;
  isAvailable: boolean;
  status: 'available' | 'unavailable' | 'sold-transferred' | 'sold-not-transferred' | 'reserved';
  floor?: string | number;
  plans?: {
    parter?: string;
    pietro?: string;
    poddasze?: string;
  };
  planPath?: string;
  investment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Prospekt {
  _id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  isActive: boolean;
  description?: string;
  uploadedBy?: string;
}

export default function Zamoyskiego2AdminPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'all'>('available');
  const [isProspektModalOpen, setIsProspektModalOpen] = useState(false);
  const [prospekty, setProspekty] = useState<Prospekt[]>([]);

  useEffect(() => {
    fetchHouses();
    fetchProspekty();
  }, []);

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/houses');
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania danych');
      }
      const data = await response.json();
      setHouses(data.houses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  const fetchProspekty = async (skipDefault = false) => {
    try {
      const url = skipDefault 
        ? '/api/prospekt?investment=zamoyskiego-2&force_default=false'
        : '/api/prospekt?investment=zamoyskiego-2';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProspekty(data.prospekty || []);
      }
    } catch (err) {
      console.error('Błąd podczas pobierania prospektów:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatPricePerM2 = (pricePerM2: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(pricePerM2);
  };

  const getStatusBadge = (status: House['status']) => {
    const statusConfig = {
      'available': { label: 'Dostępny', color: 'bg-green-100 text-green-800' },
      'reserved': { label: 'Zarezerwowany', color: 'bg-blue-100 text-blue-800' },
      'sold-transferred': { label: 'Sprzedany', color: 'bg-red-100 text-red-800' },
      'sold-not-transferred': { label: 'Sprzedany (nie przeniesiona własność)', color: 'bg-orange-100 text-orange-800' },
      'unavailable': { label: 'Niedostępny', color: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredHouses = houses.filter(house => {
    if (activeTab === 'available') {
      return ['available', 'reserved', 'sold-not-transferred'].includes(house.status);
    }
    return true;
  });

  const stats = {
    total: houses.length,
    available: houses.filter(h => h.status === 'available').length,
    reserved: houses.filter(h => h.status === 'reserved').length,
    sold: houses.filter(h => ['sold-transferred', 'sold-not-transferred'].includes(h.status)).length,
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d7c28d]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Nagłówek */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Zarządzanie Zamoyskiego 2
          </h1>
          <div className="w-24 h-1 bg-[#d7c28d] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Zarządzaj lokalami, cenami i dostępnością
          </p>
        </motion.div>

        {/* Statystyki */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-2xl font-bold text-[#d7c28d]">{stats.total}</div>
            <div className="text-sm text-gray-600">Wszystkie lokale</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-6 shadow-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-gray-600">Dostępne</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6 shadow-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.reserved}</div>
            <div className="text-sm text-gray-600">Zarezerwowane</div>
          </div>
          <div className="bg-red-50 rounded-2xl p-6 shadow-lg text-center">
            <div className="text-2xl font-bold text-red-600">{stats.sold}</div>
            <div className="text-sm text-gray-600">Sprzedane</div>
          </div>
        </motion.div>

        {/* Przycisk zarządzania prospektem */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-8 text-center"
        >
          <button
            onClick={() => setIsProspektModalOpen(true)}
            className="bg-[#d7c28d] hover:bg-[#c4a76a] text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto cursor-pointer"
          >
            <HiOutlineDocumentText className="w-5 h-5" />
            <span>Zarządzaj prospektem informacyjnym</span>
            {prospekty.some(p => p.isActive) && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs ml-2">
                Aktywny
              </span>
            )}
          </button>
        </motion.div>


        {/* Zakładki */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white rounded-2xl p-1 shadow-lg max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:ring-offset-2 ${
                activeTab === 'available'
                  ? 'bg-[#d7c28d] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Dostępne
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:ring-offset-2 ${
                activeTab === 'all'
                  ? 'bg-[#d7c28d] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Wszystkie
            </button>
          </div>
        </motion.div>

        {/* Tabela */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-[#d7c28d]/10 to-[#c4a76a]/5">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Lokal
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Piętro
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Metraż
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Cena
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Cena/m²
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredHouses.map((house, index) => (
                  <tr key={house._id} className={`hover:bg-gray-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-[#d7c28d] p-2 rounded-lg mr-3">
                          <HiOutlineHome className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            Dom {house.buildingNumber}{house.unitNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {house.floor === 'parter' ? 'Parter' : 
                         house.floor === 'piętro' ? 'Piętro' : 
                         house.floor === 'piętro + ogródek' ? 'Piętro + ogródek' :
                         house.floor || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {house.area} m²
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {house.status === 'sold-transferred' ? 'SPRZEDANE' : formatPrice(house.price)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {house.status === 'sold-transferred' ? 'SPRZEDANE' : formatPricePerM2(house.pricePerM2)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getStatusBadge(house.status)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <Link href={`/78d9f2a1-6b5c-4e8a-9d3f-1c7b2e4f6a8d-admin/zamoyskiego-2/edit/${house._id}`}>
                        <button className="bg-[#d7c28d] hover:bg-[#c4a76a] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:ring-offset-2">
                          <HiOutlinePencil className="w-4 h-4" />
                          <span>Edytuj</span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4"
          >
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        )}
      </div>

      {/* Modal prospektu */}
        <ProspektModal
          isOpen={isProspektModalOpen}
          onClose={() => setIsProspektModalOpen(false)}
          prospekty={prospekty}
          onRefresh={fetchProspekty}
          onRefreshAfterDelete={() => fetchProspekty(true)}
        />
    </div>
  );
}
