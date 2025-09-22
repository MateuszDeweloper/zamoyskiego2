'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminClient({ children }: { children: React.ReactNode }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Middleware już obsłużył autoryzację
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Middleware już obsłużył autoryzację - nie potrzebujemy dodatkowej walidacji
  useEffect(() => {
    // Ustaw isLoading na false, ponieważ middleware już zweryfikował autoryzację
    setIsLoading(false);
  }, []);

  // Zamykanie menu bocznego po zmianie ścieżki
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Dodatkowo wyczyść localStorage, jeśli opcja "Zapamiętaj mnie" była używana
        localStorage.removeItem('auth_remember');
        router.push('/login');
      } else {
        console.error('Błąd wylogowania');
      }
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Wyświetl spinnner ładowania podczas sprawdzania autoryzacji
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#083638]"></div>
      </div>
    );
  }

  // Funkcja zwracająca tytuł sekcji na podstawie ścieżki
  const getPageTitle = () => {
    if (pathname.includes('/admin/osiedle-osowiec')) {
      return 'Zarządzanie lokalami - Osiedle Osowiec';
    }
    return 'Panel administracyjny - Osiedle Osowiec';
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Nagłówek mobilny */}
      <header className="md:hidden sticky top-0 z-20 shadow-md">
        <div className="bg-[#d7c28d] border-b border-[#c4a76a]/20 py-3">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-medium font-serif">Panel Osiedle Osowiec</h1>
            </div>
            <button
              className="text-on-dark p-2 focus:outline-none"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Menu"
            >
              {isSidebarOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Menu rozwijane mobilne */}
        <div 
          className={`bg-white border-b border-gray-200 overflow-hidden transition-all duration-300 ${
            isSidebarOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <div className="p-4 space-y-4">
            {/* Nagłówek sekcji - przeniesiony na początek */}
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-xl font-medium text-[#d7c28d]">{getPageTitle()}</h1>
              <p className="text-sm text-gray-600">Przeglądaj i edytuj dostępność oraz ceny domów</p>
            </div>
            
            {/* Linki nawigacyjne */}
            <nav>
              <ul className="space-y-2">
                {/* Strona główna */}
                <li>
                  <Link
                    href="/admin"
                    className={`block px-4 py-2 rounded-xl transition-colors ${
                      pathname === '/admin'
                        ? 'bg-[#d7c28d]/10 text-[#d7c28d] font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      <span className="whitespace-nowrap">Strona główna</span>
                    </div>
                  </Link>
                </li>
                
                {/* Osiedle Osowiec */}
                <li>
                  <Link
                    href="/admin/osiedle-osowiec"
                    className={`block px-4 py-2 rounded-xl transition-colors ${
                      pathname === '/admin/osiedle-osowiec'
                        ? 'bg-[#d7c28d]/10 text-[#d7c28d] font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span className={`whitespace-nowrap ${pathname === '/admin/osiedle-osowiec' ? 'text-[#d7c28d]' : ''}`}>Osiedle Osowiec</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Przycisk wylogowania - przeniesiony na koniec */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center px-4 py-3 rounded-md bg-red-700 hover:bg-red-800 text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {isLoggingOut ? 'Wylogowywanie...' : 'Wyloguj'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Nagłówek i boczny panel dla desktopa */}
      <div className="hidden md:block fixed top-0 left-0 w-80 h-full bg-white shadow-md z-20">
        <div className="bg-[#d7c28d] border-b border-[#c4a76a]/20 py-4 px-4">
          <h1 className="text-white text-xl font-medium font-serif">Panel Osiedle Osowiec</h1>
        </div>
        <nav className="p-4 flex flex-col h-[calc(100%-80px)]">
          <ul className="space-y-2">
            {/* Strona główna */}
            <li>
              <Link
                href="/admin"
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  pathname === '/admin'
                    ? 'bg-[#d7c28d] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className={`whitespace-nowrap ${pathname === '/admin' ? 'text-white' : ''}`}>Strona główna</span>
              </Link>
            </li>
            
            {/* Osiedle Osowiec */}
            <li>
              <Link
                href="/admin/osiedle-osowiec"
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  pathname === '/admin/osiedle-osowiec'
                    ? 'bg-[#d7c28d] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className={`whitespace-nowrap ${pathname === '/admin/osiedle-osowiec' ? 'text-white' : ''}`}>Osiedle Osowiec</span>
              </Link>
            </li>
          </ul>

          
          {/* Przycisk wylogowania na dole menu - widoczny tylko na desktopie */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`w-full flex items-center px-4 py-3 rounded-md transition-colors bg-red-700 text-white hover:bg-red-800 ${
                isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoggingOut ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Wylogowywanie...
                </span>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Wyloguj
                </>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Treść strony dla desktopa */}
      <div className="md:ml-80 flex-1 flex flex-col">
        {/* Główna treść */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
