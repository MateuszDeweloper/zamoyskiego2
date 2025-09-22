"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlineClock, HiArrowUp, HiArrowDown } from 'react-icons/hi';

interface PriceHistoryEntry {
  _id?: string;
  investment: string;
  buildingNumber: string | number;
  unitNumber: string | number;
  area: number;
  price: number;
  pricePerM2: number;
  changeType: 'initial' | 'increase' | 'decrease';
  previousPrice?: number;
  previousPricePerM2?: number;
  priceChange?: number;
  priceChangePercent?: number;
  changeDate: string;
  createdAt: string;
}

interface PriceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment: string;
  buildingNumber: string | number;
  unitNumber: string | number;
  area: number;
}

export default function PriceHistoryModal({
  isOpen,
  onClose,
  investment,
  buildingNumber,
  unitNumber,
  area
}: PriceHistoryModalProps) {
  const [history, setHistory] = useState<PriceHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPriceHistory();
    }
  }, [isOpen, investment, buildingNumber, unitNumber]);

  const fetchPriceHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `/api/price-history?buildingNumber=${buildingNumber}&unitNumber=${unitNumber}`
      );
      
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania historii cen');
      }
      
      const data = await response.json();
      
      // Sprawdzamy czy dane przychodzą w oczekiwanej strukturze
      if (data && Array.isArray(data.priceHistory)) {
        // Konwertuj dane do formatu oczekiwanego przez modal z obliczeniem różnic
        const formattedHistory = data.priceHistory.map((entry: any, index: number) => {
          const isFirstEntry = index === 0;
          const previousEntry = index > 0 ? data.priceHistory[index - 1] : null;
          
          let changeType: 'initial' | 'increase' | 'decrease' = 'initial';
          let priceChange = 0;
          let priceChangePercent = 0;
          
          if (!isFirstEntry && previousEntry) {
            priceChange = entry.price - previousEntry.price;
            priceChangePercent = Math.round((priceChange / previousEntry.price) * 100 * 100) / 100; // Zaokrąglenie do 2 miejsc
            
            if (priceChange > 0) {
              changeType = 'increase';
            } else if (priceChange < 0) {
              changeType = 'decrease';
            }
          }
          
          return {
            ...entry,
            changeDate: entry.date || entry.createdAt,
            createdAt: entry.createdAt || entry.date,
            changeType,
            priceChange,
            priceChangePercent,
            pricePerM2: entry.pricePerM2 || Math.round((entry.price || 0) / area)
          };
        });
        
        setHistory(formattedHistory);
      } else {
        // Jeśli nie ma tablicy priceHistory, ustawiamy pustą tablicę
        setHistory([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
      console.error('Błąd podczas pobierania historii cen:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL').format(price) + ' zł';
  };

  const formatPricePerM2 = (price: number) => {
    return new Intl.NumberFormat('pl-PL').format(Math.round(price)) + ' zł';
  };

  const getChangeText = (entry: PriceHistoryEntry) => {
    if (entry.changeType === 'initial') {
      return 'Pierwsza cena';
    }
    
    // Jeśli nie ma różnic cen, nie pokazuj różnic
    if (entry.priceChange === 0 || entry.priceChangePercent === 0) {
      return 'Brak zmiany';
    }
    
    // Pokazuj różnice z wyraźnym formatowaniem
    const changeText = `${(entry.priceChange || 0) > 0 ? '+' : ''}${formatPrice(entry.priceChange || 0)} (${(entry.priceChangePercent || 0) > 0 ? '+' : ''}${entry.priceChangePercent || 0}%)`;
    return changeText;
  };

  const getChangeIcon = (entry: PriceHistoryEntry) => {
    if (entry.changeType === 'initial') return null;
    
    if (!entry.priceChange || !entry.priceChangePercent) {
      return null;
    }
    
    if (entry.changeType === 'increase') return <HiArrowUp className="w-4 h-4 inline mr-1" />;
    if (entry.changeType === 'decrease') return <HiArrowDown className="w-4 h-4 inline mr-1" />;
    return null;
  };

  const getChangeColor = (entry: PriceHistoryEntry) => {
    if (entry.changeType === 'initial') return 'text-gray-600';
    
    // Jeśli nie ma różnic cen, neutralny kolor
    if (entry.priceChange === 0 || entry.priceChangePercent === 0) {
      return 'text-gray-600';
    }
    
    if (entry.changeType === 'increase') return 'text-red-600 font-bold text-lg';
    if (entry.changeType === 'decrease') return 'text-green-600 font-bold text-lg';
    return 'text-gray-600';
  };

  const getTimelineColor = (entry: PriceHistoryEntry) => {
    if (entry.changeType === 'initial') return 'bg-gray-400';
    
    // Jeśli nie ma różnic cen, neutralny kolor
    if (entry.priceChange === 0 || entry.priceChangePercent === 0) {
      return 'bg-gray-400';
    }
    
    if (entry.changeType === 'increase') return 'bg-red-500 shadow-lg ring-2 ring-red-200';
    if (entry.changeType === 'decrease') return 'bg-green-500 shadow-lg ring-2 ring-green-200';
    return 'bg-gray-400';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nagłówek */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#d7c28d]/10 to-[#d7c28d]/5">
              <div className="flex items-center space-x-3">
                <div className="bg-[#d7c28d] p-3 rounded-xl shadow-lg">
                  <HiOutlineClock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Historia cen
                  </h2>
                  <p className="text-sm text-gray-600">
                    Dom {buildingNumber}{unitNumber} • {area.toFixed(2)} m²
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#d7c28d]/10 rounded-xl transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:ring-offset-2"
              >
                <HiOutlineX className="h-5 w-5 text-gray-500" />
              </button>
            </div>


            {/* Zawartość */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d7c28d]"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={fetchPriceHistory}
                    className="bg-[#d7c28d] hover:bg-[#c3aa69] text-white px-6 py-3 rounded-xl transition-colors font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:ring-offset-2"
                  >
                    Spróbuj ponownie
                  </button>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-[#d7c28d]/10 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <HiOutlineClock className="h-8 w-8 text-[#d7c28d]" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Brak historii cen</h3>
                  <p className="text-gray-600">
                    Historia cen zostanie utworzona po pierwszej edycji ceny w panelu administracyjnym.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Timeline */}
                  <div className="relative">
                    {/* Linia osi czasu */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#d7c28d]/30"></div>
                    
                    {/* Wpisy */}
                    {Array.isArray(history) && history.map((entry, index) => (
                      <div key={entry._id || index} className="relative flex items-start space-x-4">
                        {/* Marker */}
                        <div className={`relative z-10 w-8 h-8 rounded-full border-4 border-white shadow-lg ${getTimelineColor(entry)}`}></div>
                        
                        {/* Zawartość */}
                        <div className="flex-1 min-w-0 pb-6">
                          <div className={`bg-white rounded-2xl p-6 border shadow-sm ${
                            entry.changeType === 'increase' 
                              ? 'border-red-200 bg-red-50/30' 
                              : entry.changeType === 'decrease' 
                              ? 'border-green-200 bg-green-50/30' 
                              : 'border-gray-100'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4 mb-3">
                                  <span className="text-sm font-medium text-gray-700">
                                    {formatDate(entry.changeDate)}
                                  </span>
                                  <span className={`text-sm font-medium ${getChangeColor(entry)} flex items-center gap-1 px-3 py-1 rounded-full ${
                                    entry.changeType === 'increase' 
                                      ? 'bg-red-100 text-red-700' 
                                      : entry.changeType === 'decrease' 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {getChangeIcon(entry)}
                                    {getChangeText(entry)}
                                  </span>
                                </div>
                                <div className="mt-2 text-lg font-semibold text-[#d7c28d]">
                                  {formatPrice(entry.price)} za całość
                                </div>
                                <div className="text-sm text-gray-600">
                                  {formatPricePerM2(entry.pricePerM2)}/m²
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}