'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Sprawdź czy użytkownik już zaakceptował cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    // Jeśli nie ma informacji o akceptacji, pokaż baner
    if (!cookiesAccepted) {
      // Małe opóźnienie, aby baner pojawił się po załadowaniu strony
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    // Zapisz informację o akceptacji w localStorage
    localStorage.setItem('cookiesAccepted', 'true');
    // Ukryj baner
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-6 left-4 right-4 z-50 bg-[#222222]/95 backdrop-blur-md border border-[#333333] rounded-lg shadow-2xl text-white"
        >
          <div className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2 text-[#b39a65] relative inline-block">
                  Pliki cookies
                  <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#b39a65]"></span>
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Ta strona używa plików cookies, aby zapewnić najlepsze doświadczenia podczas korzystania z naszej witryny. 
                  Korzystając z naszej strony, wyrażasz zgodę na używanie plików cookies zgodnie z 
                  <Link href="/polityka-prywatnosci" className="text-[#b39a65] hover:text-[#a38a55] transition-colors duration-300 ml-1">
                    polityką prywatności
                  </Link>.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={acceptCookies}
                  className="bg-[#b39a65] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#a38a55] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                >
                  Akceptuję
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner; 