"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineHome, HiOutlineSave, HiOutlineArrowLeft } from 'react-icons/hi';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

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

export default function EditHousePage() {
  const params = useParams();
  const router = useRouter();
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    price: '',
    status: 'available' as House['status']
  });

  useEffect(() => {
    if (params.id) {
      fetchHouse(params.id as string);
    }
  }, [params.id]);

  const fetchHouse = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/houses/${id}?investment=osiedle-osowiec`);
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania danych lokalu');
      }
      const data = await response.json();
      setHouse(data);
      setFormData({
        price: data.price.toString(),
        status: data.status
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/houses/${house?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: parseFloat(formData.price),
          status: formData.status
        }),
      });

      if (!response.ok) {
        throw new Error('Błąd podczas zapisywania zmian');
      }

      router.push('/admin/osiedle-osowiec');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d7c28d]"></div>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Lokal nie został znaleziony</h1>
            <Link href="/admin/osiedle-osowiec">
              <button className="bg-[#d7c28d] hover:bg-[#c4a76a] text-white px-6 py-3 rounded-2xl font-medium transition-colors duration-200 font-serif">
                Powrót do listy
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Nagłówek */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center mb-6">
            <Link href="/admin/osiedle-osowiec">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl mr-4 transition-colors duration-200">
                <HiOutlineArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 font-serif">
                Edycja lokalu {house.buildingNumber} lok {house.unitNumber}
              </h1>
              <p className="text-gray-600 font-serif">Osiedle Osowiec</p>
            </div>
          </div>
        </motion.div>

        {/* Formularz */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Nagłówek formularza */}
          <div className="bg-gradient-to-r from-[#d7c28d]/10 to-[#c4a76a]/5 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="bg-[#d7c28d] p-3 rounded-xl mr-4">
                <HiOutlineHome className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 font-serif">Szczegóły lokalu</h2>
                <p className="text-sm text-gray-600 font-serif">Edytuj informacje o lokalu</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Informacje o lokalu - tylko do wyświetlenia */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 font-serif flex items-center">
                <div className="w-2 h-2 bg-[#d7c28d] rounded-full mr-3"></div>
                Informacje o lokalu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600 font-serif">Lokal:</span>
                  <span className="ml-2 text-gray-800 font-serif">{house.buildingNumber} lok {house.unitNumber}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600 font-serif">Metraż:</span>
                  <span className="ml-2 text-gray-800 font-serif">{house.area} m²</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600 font-serif">Cena za m²:</span>
                  <span className="ml-2 text-gray-800 font-serif">{house.pricePerM2.toLocaleString('pl-PL')} zł/m²</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600 font-serif">Piętro:</span>
                  <span className="ml-2 text-gray-800 font-serif">{house.floor || 'Nie określono'}</span>
                </div>
              </div>
            </div>

            {/* Edycja - tylko cena i status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 font-serif flex items-center">
                <div className="w-2 h-2 bg-[#d7c28d] rounded-full mr-3"></div>
                Edycja
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cena */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2 font-serif">
                    Cena (zł)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:border-transparent transition-all duration-200 font-serif"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2 font-serif">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:border-transparent transition-all duration-200 font-serif"
                  >
                    <option value="available">Dostępny</option>
                    <option value="reserved">Zarezerwowany</option>
                    <option value="sold-transferred">Sprzedany</option>
                    <option value="sold-not-transferred">Sprzedany (nie przeniesiona własność)</option>
                    <option value="unavailable">Niedostępny</option>
                    <option value="ii-etap">II ETAP</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-serif">{error}</p>
              </div>
            )}

            {/* Przyciski */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100">
              <Link href="/admin/osiedle-osowiec">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-serif shadow-sm hover:shadow-md"
                >
                  Anuluj
                </button>
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#d7c28d] hover:bg-[#c4a76a] text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-serif shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Zapisywanie...
                  </>
                ) : (
                  <>
                    <HiOutlineSave className="w-4 h-4 mr-2" />
                    Zapisz zmiany
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
