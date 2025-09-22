'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaMapMarkerAlt, FaHome } from 'react-icons/fa';
import { BiArea } from 'react-icons/bi';
import { ASSET_PATHS } from '@/lib/assets';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  
  const backgroundImages = [
    ASSET_PATHS.photos.image24,
    ASSET_PATHS.photos.image15,
    ASSET_PATHS.photos.image17,
    ASSET_PATHS.photos.image19,
    ASSET_PATHS.photos.image21
  ];
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Automatyczne przełączanie slajdów
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, []);

  // Funkcja do obsługi płynnego przewijania do sekcji
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Pobierz wysokość nawigacji
      const navHeight = document.querySelector('nav')?.clientHeight || 0;
      const offset = navHeight; // Offset uwzględniający nawigację
      
      // Oblicz pozycję elementu docelowego z uwzględnieniem offsetu
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
      
      // Płynne przewijanie z animacją
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-16 md:pt-0" id="home">
      {/* Animowane elementy dekoracyjne */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 right-10 w-40 h-40 bg-[#b39a65]/15 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-10 w-32 h-32 bg-[#b39a65]/15 rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
      </div>
      
      {/* Tło z gradientem */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/40 z-10" />
      
      {/* Tło z karuzelą zdjęć */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <motion.div 
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentSlide === index ? 1 : 0,
              scale: currentSlide === index ? 1 : 1.05
            }}
            transition={{ 
              opacity: { duration: 1.2 },
              scale: { duration: 5 }
            }}
          >
            <Image
              src={image}
              alt={`ASCANA - Zamoyskiego 2 - zdjęcie ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Zawartość */}
      <div className="container-custom relative mt-10 md:mt-0 z-20 h-full flex flex-col justify-center items-start">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mt-20"
        >
          {/* Tytuł inwestycji */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="overflow-hidden mb-4"
          >
            <motion.h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-xl">
              Zamoyskiego <span className="text-[#e3ca88] drop-shadow-lg">2</span>
            </motion.h1>
          </motion.div>
          
          {/* Opis inwestycji */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <div className="text-white text-xl md:text-2xl leading-relaxed max-w-2xl drop-shadow-xl bg-black/30 p-6 rounded-lg backdrop-blur-sm">
              <p className="mb-4">Nowoczesne domy w zabudowie szeregowej w prestiżowej lokalizacji Stalowej Woli.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center">
                  <FaHome className="text-[#d2b978] mr-3 text-xl" />
                  <span>26 komfortowych lokali</span>
                </div>
                <div className="flex items-center">
                  <BiArea className="text-[#d2b978] mr-3 text-xl" />
                  <span>56-59 m² powierzchni</span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-[#d2b978] mr-3 text-xl" />
                  <span>Stalowa Wola, ul. Zamoyskiego 18</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#d2b978] mr-3"></div>
                  <span>Termin oddania: 2025</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Przyciski CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-32 md:mb-0"
          >
            <a 
              href="#wybierz-dom" 
              onClick={(e) => handleSmoothScroll(e, 'wybierz-dom')}
              className="bg-[#b39a65] text-white px-8 py-4 rounded-md font-medium hover:bg-[#a38a55] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] text-base md:text-lg flex items-center justify-center group"
            >
              <span>Wybierz dom</span>
              <FaArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a 
              href="#kontakt" 
              onClick={(e) => handleSmoothScroll(e, 'kontakt')}
              className="border-2 border-white text-white px-8 py-4 rounded-md font-medium hover:bg-white hover:text-[#2a2a2a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] text-base md:text-lg flex items-center justify-center"
            >
              <span>Kontakt</span>
            </a>
          </motion.div>
        </motion.div>
        
        {/* Plakietka z informacją o inwestycji */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute right-10 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-md p-6 rounded-lg border border-[#b39a65]/30 max-w-xs hidden lg:block shadow-xl"
        >
          <div className="flex items-center mb-3">
            <div className="w-2 h-8 bg-[#d2b978] mr-3"></div>
            <h3 className="text-[#d2b978] font-bold text-xl drop-shadow-md">Nowa inwestycja</h3>
          </div>
          
          <div className="mb-4">
            <h4 className="text-white font-bold text-lg mb-1 drop-shadow-md">Zamoyskiego 2</h4>
            <p className="text-white/80 text-sm">Kameralne osiedle domów jednorodzinnych w zabudowie szeregowej</p>
          </div>
          
          <div className="space-y-3 mb-5">
            <div className="flex items-center text-white/90 text-sm">
              <div className="w-6 h-6 rounded-full bg-[#b39a65]/20 flex items-center justify-center mr-2">
                <FaHome className="text-[#d2b978] text-xs" />
              </div>
              <span>Lokale od 56 do 59 m²</span>
            </div>
            <div className="flex items-center text-white/90 text-sm">
              <div className="w-6 h-6 rounded-full bg-[#b39a65]/20 flex items-center justify-center mr-2">
                <FaMapMarkerAlt className="text-[#d2b978] text-xs" />
              </div>
              <span>Stalowa Wola, ul. Zamoyskiego 18</span>
            </div>
          </div>
          
          <a 
            href="#wybierz-dom" 
            onClick={(e) => handleSmoothScroll(e, 'wybierz-dom')}
            className="bg-[#b39a65]/80 hover:bg-[#b39a65] text-white transition-all duration-300 text-sm font-medium flex items-center justify-center py-2 px-4 rounded-md group w-full relative z-40 mb-2"
          >
            Dowiedz się więcej
            <svg className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
        
        {/* Wskaźniki slajdów */}
        <div className="absolute bottom-2 md:bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30 py-2 md:py-0">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                if (slideInterval.current) {
                  clearInterval(slideInterval.current);
                }
                slideInterval.current = setInterval(() => {
                  setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
                }, 5000);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-[#c5ab75] w-6' : 'bg-white/50 hover:bg-white/80'}`}
              aria-label={`Przejdź do zdjęcia ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;