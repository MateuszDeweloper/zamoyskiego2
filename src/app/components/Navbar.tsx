'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { ASSET_PATHS } from '@/lib/assets';
import { BiPhoneCall } from 'react-icons/bi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Główne menu */}
      <nav 
        className={`fixed w-full z-50 duration-300 ${
          scrolled ? 'bg-[#1a1a1a]/95 shadow-lg py-5' : 'bg-transparent py-5'
        }`}
      >
      <div className="container-custom flex justify-between items-center">
        <Link href="/" className="z-50 relative overflow-hidden group">
          <div className="relative z-10 transition-all duration-300 transform group-hover:scale-105 w-[280px] h-[70px]">
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={ASSET_PATHS.logoWhite}
                alt="ASCANA Logo"
                width={280}
                height={70}
                className={`transition-opacity duration-700 ease-in-out absolute inset-0 w-full h-full object-contain ${scrolled ? 'opacity-0' : 'opacity-100'}`}
                priority
              />
              <Image
                src={ASSET_PATHS.logoStandard}
                alt="ASCANA Logo"
                width={280}
                height={70}
                className={`transition-opacity duration-700 ease-in-out absolute inset-0 w-full h-full object-contain ${scrolled ? 'opacity-100' : 'opacity-0'}`}
                priority
              />
            </div>
          </div>
        </Link>

        {/* Menu na desktop */}
        <div className="hidden md:flex space-x-10">
          <div className="flex space-x-10 pt-3">
            <NavLink href="/" label="Strona główna" />
            <NavLink href="#wybierz-dom" label="Wybierz dom" />
            <NavLink href="#kontakt" label="Kontakt" />
          </div>
          <a 
            href="tel:+48516516440" 
            className={`relative font-medium text-white bg-[#b39a65] hover:bg-[#a38a55] transition-all duration-300 flex items-center group ml-6 px-5 py-2.5 rounded-md shadow-md hover:shadow-lg transform hover:translate-y-[-1px]`}
          >
            <BiPhoneCall className="mr-2" />
            +48 516 516 440
          </a>
        </div>

        {/* Przycisk menu mobilnego */}
        <button 
          className="md:hidden text-2xl z-50 relative group"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#c5ab75]/10 group-hover:bg-[#c5ab75]/20 transition-all duration-300">
            {isOpen ? 
              <FaTimes className="text-[#b39a65] group-hover:text-[#a38a55] transition-all duration-300" /> : 
              <FaBars className="text-[#b39a65] group-hover:text-[#a38a55] transition-all duration-300" />
            }
          </div>
        </button>

        {/* Menu mobilne */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[#1a1a1a]/95 backdrop-blur-md flex flex-col items-center justify-center z-40"
            >
              
              <div className="flex flex-col items-center space-y-8">
                <MobileNavLink href="/" label="Strona główna" onClick={() => setIsOpen(false)} />
                <MobileNavLink href="#wybierz-dom" label="Wybierz dom" onClick={() => setIsOpen(false)} />
                <MobileNavLink href="#kontakt" label="Kontakt" onClick={() => setIsOpen(false)} />
              </div>
              
              <div className="absolute bottom-10 flex flex-col items-center space-y-4">
                <a 
                  href="tel:+48516516440" 
                  className="font-medium text-white bg-[#b39a65] hover:bg-[#a38a55] transition-all duration-300 flex items-center px-6 py-3 rounded-md shadow-md hover:shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <BiPhoneCall className="mr-2" />
                  +48 516 516 440
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
    </>
  );
};

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Jeśli to link wewnętrzny (zaczyna się od #)
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Pobierz wysokość nawigacji
        const navHeight = document.querySelector('nav')?.clientHeight || 0;
        const offset = navHeight; // Dodatkowy margines 20px
        
        // Oblicz pozycję elementu docelowego z uwzględnieniem offsetu
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
        
        // Płynne przewijanie z animacją
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <Link 
      href={href}
      onClick={handleClick}
      className="relative font-medium text-[#2a2a2a] dark:text-white hover:text-[#b39a65] transition-colors duration-300 group text-base tracking-wide"
    >
      {label}
      <span className="absolute bottom-0 left-0 h-0.5 bg-[#b39a65] transition-all duration-300 w-0 group-hover:w-full"></span>
    </Link>
  );
};

const MobileNavLink = ({ href, label, onClick }: { href: string; label: string; onClick: () => void }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Najpierw zamknij menu mobilne
    onClick();
    
    // Jeśli to link wewnętrzny (zaczyna się od #)
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Dodaj małe opóźnienie, aby menu zdążyło się zamknąć
        setTimeout(() => {
          // Pobierz wysokość nawigacji (z dodatkowym marginesem dla wygody)
          const navHeight = document.querySelector('nav')?.clientHeight || 0;
          const offset = navHeight + 20; // Dodatkowy margines 20px
          
          // Oblicz pozycję elementu docelowego z uwzględnieniem offsetu
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          // Płynne przewijanie
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }, 300); // Opóźnienie 300ms, aby menu zdążyło się zamknąć
      }
    }
  };

  return (
    <Link 
      href={href}
      className="text-2xl font-medium text-white hover:text-[#b39a65] transition-colors duration-300 relative"
      onClick={handleClick}
    >
      {label}
    </Link>
  );
};

export default Navbar;