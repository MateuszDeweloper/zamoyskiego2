"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Sprawdź, czy użytkownik ma zapisaną sesję przy ładowaniu strony
  useEffect(() => {
    const savedSession = localStorage.getItem('auth_remember');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        if (sessionData.username) {
          setUsername(sessionData.username);
          setRememberMe(true);
          
          // Opcjonalnie, możemy automatycznie zalogować użytkownika 
          // jeśli zapisany był token (nie implementujemy tutaj pełnego auto-logowania)
        }
      } catch (err) {
        // Jeśli dane są uszkodzone, usuń je
        localStorage.removeItem('auth_remember');
      }
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          password,
          rememberMe
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas logowania');
      }

      // Jeśli wybrano "Zapamiętaj mnie", zapisz dane logowania w localStorage
      if (rememberMe) {
        localStorage.setItem('auth_remember', JSON.stringify({
          username,
          timestamp: new Date().getTime()
        }));
      } else {
        // Jeśli nie wybrano "Zapamiętaj mnie", usuń zapisane dane
        localStorage.removeItem('auth_remember');
      }

      // Przekieruj do panelu admin po udanym logowaniu
      router.push('/78d9f2a1-6b5c-4e8a-9d3f-1c7b2e4f6a8d-admin/');
    } catch (err: any) {
      setError(err.message || 'Wystąpił nieznany błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 relative">
      {/* Hero Section z tłem */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d7c28d]/20 to-[#c4a76a]/10"></div>
          <Image
            src="/assets/photos/Image24.png"
            alt="Tło logowania - Zamoyskiego 2"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
            quality={90}
          />
        </div>
        
        <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm shadow-2xl rounded-2xl px-8 py-12">
            <div className="flex flex-col items-center mb-8">
              <Image
                src="/assets/logo-nobg.png"
                alt="ASCANA Logo"
                width={220}
                height={70}
                className="h-auto w-auto max-w-[180px] sm:max-w-[220px] mb-6"
                priority
              />
              <h1 className="text-2xl sm:text-3xl text-[#d7c28d] font-medium mb-2 text-center" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.5rem)' }}>
                Panel Administracyjny
              </h1>
              <p className="text-gray-600 text-sm text-center">
                Zaloguj się, aby zarządzać Zamoyskiego 2
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#d7c28d] mb-2">
                  Nazwa użytkownika
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d7c28d]/30 focus:border-[#d7c28d] transition-all duration-300"
                  placeholder="Wprowadź nazwę użytkownika"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#d7c28d] mb-2">
                  Hasło
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d7c28d]/30 focus:border-[#d7c28d] transition-all duration-300"
                    placeholder="Wprowadź hasło"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#d7c28d] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:ring-offset-2 rounded-md p-1"
                    aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M9 9a3 3 0 015.83 1M15.5 12.5a3 3 0 11-5.83-1M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#d7c28d] rounded border-gray-300 focus:ring-[#d7c28d]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  Zapamiętaj mnie
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-[#d7c28d] hover:bg-[#c4a76a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d7c28d] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logowanie...
                  </div>
                ) : (
                  'Zaloguj się'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center text-[#d7c28d] hover:text-[#c4a76a] transition-colors text-sm sm:text-base"
              >
                ← Powrót do strony głównej
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
