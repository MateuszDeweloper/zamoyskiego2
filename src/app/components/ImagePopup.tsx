"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ImagePopupProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isDragging: boolean;
  position: { x: number; y: number };
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export default function ImagePopup({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isDragging,
  position,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave
}: ImagePopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          onPrev();
          break;
        case "ArrowRight":
          onNext();
          break;
        case "=":
        case "+":
          e.preventDefault();
          onZoomIn();
          break;
        case "-":
          e.preventDefault();
          onZoomOut();
          break;
        case "0":
          onResetZoom();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev, onZoomIn, onZoomOut, onResetZoom]);

  // Blokuj przewijanie strony gdy popup jest otwarty
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-400 ${
        isOpen ? 'opacity-100 backdrop-blur-md' : 'opacity-0 backdrop-blur-none'
      }`}
      onClick={onClose}
    >
      <div 
        className={`relative w-[90vw] h-[85vh] max-w-[1200px] max-h-[800px] overflow-hidden rounded-lg shadow-xl transition-all duration-400 ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'
        }`}
        onClick={(e) => e.stopPropagation()}
        ref={popupRef}
      >
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
            <div className="w-16 h-16 border-4 border-[#b39a65] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div 
          className={`relative w-full h-full overflow-hidden bg-black/60 ${zoomLevel > 1 ? 'cursor-grab' : ''} ${isDragging && zoomLevel > 1 ? 'cursor-grabbing' : ''}`}
          onMouseDown={zoomLevel > 1 ? onMouseDown : undefined}
          onMouseMove={zoomLevel > 1 ? onMouseMove : undefined}
          onMouseUp={zoomLevel > 1 ? onMouseUp : undefined}
          onMouseLeave={zoomLevel > 1 ? onMouseLeave : undefined}
        >
          <div className="transition-all duration-300 w-full h-full flex items-center justify-center">
            <Image
              src={images[currentIndex]}
              alt={`Zdjęcie ${currentIndex + 1}`}
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, 1200px"
              ref={imageRef}
              style={{ 
                transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
              onLoad={() => setIsImageLoading(false)}
              draggable={false}
              priority
            />
          </div>
        </div>

        {/* Kontrolki zoomu */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button 
            className="bg-[#b39a65] text-white w-10 h-10 rounded-full opacity-90 hover:opacity-100 transition-opacity focus:outline-none flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer"
            onClick={onZoomOut}
            title="Pomniejsz (klawisz -)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
            </svg>
          </button>
          <button 
            className="bg-[#b39a65] text-white w-10 h-10 rounded-full opacity-90 hover:opacity-100 transition-opacity focus:outline-none flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer"
            onClick={onResetZoom}
            title="Resetuj zoom (klawisz 0)"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 9C8.5 7.5 10.5 6.5 12.5 6.5c2 0 4 1 5.5 2.5" />
              <polyline points="18 9 19.5 7.5 18 6" />
              <path d="M17 15c-1.5 1.5-3.5 2.5-5.5 2.5c-2 0-4-1-5.5-2.5" />
              <polyline points="6 15 4.5 16.5 6 18" />
            </svg>
          </button>
          <button 
            className="bg-[#b39a65] text-white w-10 h-10 rounded-full opacity-90 hover:opacity-100 transition-opacity focus:outline-none flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer"
            onClick={onZoomIn}
            title="Powiększ (klawisz +)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
          </button>
        </div>

        {/* Przycisk zamknięcia */}
        <button
          className="absolute top-4 right-4 text-white bg-[#b39a65] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#a38a55] transition-all shadow-lg hover:shadow-xl cursor-pointer"
          onClick={onClose}
          title="Zamknij (klawisz Esc)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>

        {/* Przyciski nawigacji */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#b39a65] p-3 rounded-full transition-all duration-200 shadow-lg hover:scale-110 active:scale-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#b39a65] p-3 rounded-full transition-all duration-200 shadow-lg hover:scale-110 active:scale-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Informacja o poziomie zoomu */}
        <div className="absolute bottom-4 left-4 bg-[#b39a65] bg-opacity-90 px-3 py-1.5 rounded-full shadow-md text-sm font-medium">
          <span className="text-white">{Math.round(zoomLevel * 100)}%</span>
        </div>

        {/* Instrukcja przesuwania */}
        {zoomLevel > 1 && (
          <div className="absolute top-4 left-4 bg-[#b39a65] bg-opacity-90 text-white px-3 py-1.5 rounded-full shadow-md text-sm font-medium max-w-[200px] flex items-center transition-all duration-300">
            <span className="mr-2 text-base">↔️</span>
            <span className="text-white">Złap i przesuń</span>
          </div>
        )}

        {/* Licznik zdjęć */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#b39a65] bg-opacity-90 px-4 py-1.5 rounded-full shadow-md text-sm font-medium">
          <span className="text-white">{currentIndex + 1} / {images.length}</span>
        </div>
      </div>
    </div>
  );
}