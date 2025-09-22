"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineHome, HiOutlinePencil, HiOutlineClock, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import Link from 'next/link';

interface House {
  _id?: string;
  buildingNumber: string | number;
  unitNumber: string | number;
  area: number;
  price: number;
  pricePerM2: number;
  auxiliaryRooms: string;
  isAvailable: boolean;
  status: 'available' | 'unavailable' | 'sold-transferred' | 'sold-not-transferred' | 'reserved' | 'ii-etap';
  floor?: string;
  plans: {
    parter: string;
    pietro: string;
    poddasze?: string;
  };
  planPath?: string;
  investment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function OsiedleOsowiecAdminPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'all'>('available');

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/houses?investment=osiedle-osowiec');
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania danych');
      }
      const data = await response.json();
      setHouses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setLoading(false);
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
      'sold-not-transferred': { label: 'Sprzedany', color: 'bg-red-100 text-red-800' },
      'unavailable': { label: 'Niedostępny', color: 'bg-gray-100 text-gray-800' },
      'ii-etap': { label: 'II ETAP', color: 'bg-yellow-100 text-yellow-800' }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color} font-serif`}>
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
    iiEtap: houses.filter(h => h.status === 'ii-etap').length
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-serif">
            Zarządzanie Osiedle Osowiec
          </h1>
          <div className="w-24 h-1 bg-[#d7c28d] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-serif">
            Zarządzaj lokalami, cenami i dostępnością
          </p>
        </motion.div>

        {/* Statystyki */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-2xl font-bold text-[#d7c28d] font-serif">{stats.total}</div>
            <div className="text-sm text-gray-600 font-serif">Wszystkie lokale</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-6 shadow-lg text-center">
            <div className="text-2xl font-bold text-green-600 font-serif">{stats.available}</div>
            <div className="text-sm text-gray-600 font-serif">Dostępne</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6 shadow-lg text-center">
            <div className="text-2xl font-bold text-blue-600 font-serif">{stats.reserved}</div>
            <div className="text-sm text-gray-600 font-serif">Zarezerwowane</div>
          </div>
          <div className="bg-red-50 rounded-2xl p-6 shadow-lg text-center">
            <div className="text-2xl font-bold text-red-600 font-serif">{stats.sold}</div>
            <div className="text-sm text-gray-600 font-serif">Sprzedane</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-6 shadow-lg text-center">
            <div className="text-2xl font-bold text-yellow-600 font-serif">{stats.iiEtap}</div>
            <div className="text-sm text-gray-600 font-serif">II ETAP</div>
          </div>
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
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 font-serif ${
                activeTab === 'available'
                  ? 'bg-[#d7c28d] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Dostępne, zarezerwowane i nieprzeniesiona własność
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 font-serif ${
                activeTab === 'all'
                  ? 'bg-[#d7c28d] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Wszystkie lokale
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
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider font-serif">
                    Lokal
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider font-serif">
                    Metraż
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider font-serif">
                    Cena
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider font-serif">
                    Cena/m²
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider font-serif">
                    Status
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider font-serif">
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
                          <div className="text-sm font-semibold text-gray-900 font-serif">
                            {house.buildingNumber} lok {house.unitNumber}
                          </div>
                          {house.floor && (
                            <div className="text-xs text-gray-500 font-serif">
                              Piętro: {house.floor}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 font-serif">
                        {house.area.toFixed(2)} m²
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 font-serif">
                        {house.status === 'ii-etap' ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          formatPrice(house.price)
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-serif">
                        {house.status === 'ii-etap' ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          formatPricePerM2(house.pricePerM2)
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getStatusBadge(house.status)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <Link href={`/admin/osiedle-osowiec/edit/${house._id}`}>
                        <button className="bg-[#d7c28d] hover:bg-[#c4a76a] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 font-serif">
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
            <p className="text-red-600 text-sm font-serif">{error}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
