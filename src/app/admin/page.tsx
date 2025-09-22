"use client";

import { motion } from 'framer-motion';
import { HiOutlineHome, HiOutlineMap, HiOutlineClock, HiOutlineUsers } from 'react-icons/hi';
import Image from 'next/image';
import Link from 'next/link';
import { ASSET_PATHS } from '@/lib/assets';

export default function AdminPage() {
  const investment = {
    id: 'osiedle-osowiec',
    name: 'Osiedle Osowiec',
    address: '93-321 Osowiec, ul. Lipowa 10',
    description: 'Domki jednorodzinne dwulokalowe',
    image: ASSET_PATHS.osiedleOsowiec.wizualizacja1,
    route: '/admin/osiedle-osowiec',
    icon: HiOutlineHome,
    color: 'from-[#d7c28d] to-[#c4a76a]',
    stats: {
      totalUnits: 20,
      availableUnits: 8,
      soldUnits: 4,
      reservedUnits: 4,
      iiEtapUnits: 4
    }
  };

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
            Panel Administracyjny
          </h1>
          <div className="w-24 h-1 bg-[#d7c28d] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-serif">
            Zarządzanie inwestycją Osiedle Osowiec
          </p>
        </motion.div>

        {/* Główna karta inwestycji */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Zdjęcie */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <Image
                src={investment.image}
                alt={investment.name}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                style={{ objectFit: "cover" }}
                className="transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Badge */}
              <div className="absolute top-6 left-6">
                <span className="bg-[#d7c28d] text-white px-4 py-2 text-sm font-medium rounded-xl shadow-lg font-serif">
                  {investment.description}
                </span>
              </div>

              {/* Adres */}
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center space-x-2">
                  <HiOutlineMap className="w-5 h-5" />
                  <span className="text-lg font-semibold font-serif">{investment.address}</span>
                </div>
              </div>
            </div>

            {/* Zawartość */}
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-[#d7c28d] p-3 rounded-xl mr-4 shadow-lg">
                  <investment.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 font-serif">
                    {investment.name}
                  </h2>
                  <p className="text-gray-600 font-serif">
                    Zarządzaj lokalami, cenami i dostępnością
                  </p>
                </div>
              </div>

              
              {/* Przycisk zarządzania */}
              <div className="text-center">
                <Link href={investment.route}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#d7c28d] hover:bg-[#c4a76a] text-white font-semibold px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center font-serif"
                  >
                    <HiOutlineUsers className="w-5 h-5 mr-2" />
                    Zarządzaj inwestycją
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dodatkowe informacje */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mt-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="bg-[#d7c28d] p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <HiOutlineClock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-serif">Historia cen</h3>
              <p className="text-sm text-gray-600 font-serif">
                Śledź zmiany cen dla każdego lokalu
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="bg-[#d7c28d] p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <HiOutlineHome className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-serif">Status lokali</h3>
              <p className="text-sm text-gray-600 font-serif">
                Zarządzaj dostępnością i rezerwacjami
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="bg-[#d7c28d] p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <HiOutlineMap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-serif">Plany i dokumenty</h3>
              <p className="text-sm text-gray-600 font-serif">
                Zarządzaj kartami lokali i rzutami
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}