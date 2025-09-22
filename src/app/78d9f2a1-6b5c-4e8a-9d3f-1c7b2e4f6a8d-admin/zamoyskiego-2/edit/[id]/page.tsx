"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiOutlineHome, HiOutlineCheck, HiOutlineX, HiOutlineArrowLeft } from 'react-icons/hi';
import Link from 'next/link';

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

export default function EditHousePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    buildingNumber: '',
    unitNumber: '',
    area: 0,
    price: 0,
    status: 'available' as House['status'],
    floor: 'parter',
    auxiliaryRooms: ''
  });

  useEffect(() => {
    if (id) {
      fetchHouse();
    }
  }, [id]);

  const fetchHouse = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/houses/${id}`);
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania danych lokalu');
      }
      const data = await response.json();
      setHouse(data.house);
      
      // Ustaw dane formularza
      setFormData({
        buildingNumber: data.house.buildingNumber,
        unitNumber: data.house.unitNumber,
        area: data.house.area,
        price: data.house.price,
        status: data.house.status,
        floor: data.house.floor || 'parter',
        auxiliaryRooms: data.house.auxiliaryRooms || ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'area' || name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Oblicz cenę za m²
      const pricePerM2 = Math.round(formData.price / formData.area);

      const response = await fetch(`/api/houses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pricePerM2,
          isAvailable: formData.status === 'available'
        }),
      });

      if (!response.ok) {
        throw new Error('Błąd podczas zapisywania zmian');
      }

      setSuccess('Zmiany zostały zapisane pomyślnie!');
      
      // Odśwież dane
      await fetchHouse();
      
      // Przekieruj po 2 sekundach
      setTimeout(() => {
        router.push('/78d9f2a1-6b5c-4e8a-9d3f-1c7b2e4f6a8d-admin/zamoyskiego-2');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas zapisywania');
    } finally {
      setSaving(false);
    }
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
            <h1 className="text-2xl font-bold text-red-600 mb-4">Nie znaleziono lokalu</h1>
            <Link 
              href="/78d9f2a1-6b5c-4e8a-9d3f-1c7b2e4f6a8d-admin/zamoyskiego-2"
              className="inline-flex items-center text-[#d7c28d] hover:text-[#c4a76a] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:ring-offset-2 rounded-lg px-2 py-1"
            >
              <HiOutlineArrowLeft className="w-4 h-4 mr-2" />
              Powrót do listy
            </Link>
          </div>
        </div>
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
          className="mb-8"
        >
          <div className="flex items-center mb-6">
            <Link 
              href="/78d9f2a1-6b5c-4e8a-9d3f-1c7b2e4f6a8d-admin/zamoyskiego-2"
              className="inline-flex items-center text-[#d7c28d] hover:text-[#c4a76a] transition-colors mr-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:ring-offset-2 rounded-lg px-2 py-1"
            >
              <HiOutlineArrowLeft className="w-5 h-5 mr-2" />
              Powrót do listy
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Edytuj Dom {formData.buildingNumber}{formData.unitNumber}
          </h1>
          <div className="w-24 h-1 bg-[#d7c28d] mb-6"></div>
          <p className="text-lg text-gray-600">
            Edytuj dane lokalu i zaktualizuj informacje
          </p>
        </motion.div>

        {/* Komunikaty */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4"
          >
            <p className="text-green-600 text-sm">{success}</p>
          </motion.div>
        )}

        {/* Formularz */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="p-8">
            <div className="flex items-center mb-8">
              <div className="bg-[#d7c28d] p-3 rounded-xl mr-4">
                <HiOutlineHome className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Dane lokalu
                </h2>
                <p className="text-gray-600">
                  Wprowadź zmiany w poniższych polach
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Numer budynku */}
                <div>
                  <label htmlFor="buildingNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Numer budynku
                  </label>
                  <input
                    type="text"
                    id="buildingNumber"
                    name="buildingNumber"
                    value={formData.buildingNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:border-[#d7c28d] transition-all duration-300"
                    required
                  />
                </div>

                {/* Numer lokalu */}
                <div>
                  <label htmlFor="unitNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Numer lokalu
                  </label>
                  <input
                    type="text"
                    id="unitNumber"
                    name="unitNumber"
                    value={formData.unitNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:border-[#d7c28d] transition-all duration-300"
                    required
                  />
                </div>

                {/* Powierzchnia */}
                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                    Powierzchnia (m²)
                  </label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:border-[#d7c28d] transition-all duration-300"
                    required
                  />
                </div>

                {/* Cena */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Cena (zł)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:border-[#d7c28d] transition-all duration-300"
                    required
                  />
                </div>

                {/* Piętro */}
                <div>
                  <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-2">
                    Piętro
                  </label>
                  <select
                    id="floor"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:border-[#d7c28d] transition-all duration-300 cursor-pointer"
                  >
                    <option value="parter">Parter</option>
                    <option value="piętro">Piętro</option>
                    <option value="piętro + ogródek">Piętro + ogródek</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:border-[#d7c28d] transition-all duration-300 cursor-pointer"
                  >
                    <option value="available">Dostępny</option>
                    <option value="reserved">Zarezerwowany</option>
                    <option value="sold-not-transferred">Sprzedany (nie przeniesiona własność)</option>
                    <option value="sold-transferred">Sprzedany</option>
                    <option value="unavailable">Niedostępny</option>
                  </select>
                </div>
              </div>

              {/* Pomieszczenia przynależne */}
              <div>
                <label htmlFor="auxiliaryRooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Pomieszczenia przynależne
                </label>
                <input
                  type="text"
                  id="auxiliaryRooms"
                  name="auxiliaryRooms"
                  value={formData.auxiliaryRooms}
                  onChange={handleInputChange}
                  placeholder="np. Ogródek, Piwnica, Garaż"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:border-[#d7c28d] transition-all duration-300"
                />
              </div>

              {/* Obliczona cena za m² */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Obliczona cena za m²:</div>
                <div className="text-lg font-semibold text-[#d7c28d]">
                  {formData.area > 0 ? `${Math.round(formData.price / formData.area).toLocaleString()} zł/m²` : '0 zł/m²'}
                </div>
              </div>

              {/* Przyciski */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#d7c28d] hover:bg-[#c4a76a] text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:ring-offset-2 flex items-center justify-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Zapisywanie...
                    </>
                  ) : (
                    <>
                      <HiOutlineCheck className="w-5 h-5 mr-2" />
                      Zapisz zmiany
                    </>
                  )}
                </button>

                <Link 
                  href="/78d9f2a1-6b5c-4e8a-9d3f-1c7b2e4f6a8d-admin/zamoyskiego-2"
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 flex items-center justify-center"
                >
                  <HiOutlineX className="w-5 h-5 mr-2" />
                  Anuluj
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
