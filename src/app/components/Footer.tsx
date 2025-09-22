'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaPhone, FaEnvelope } from 'react-icons/fa';
import { ASSET_PATHS } from '@/lib/assets';
import { CONTACT_INFO } from '@/lib/constants';

// Komponent do obsługi linków nawigacyjnych w stopce
const FooterNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Jeśli to link wewnętrzny (zaczyna się od #)
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
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
      }
    }
  };

  return (
    <Link 
      href={href}
      onClick={handleClick}
      className="text-gray-300 hover:text-[#b39a65] transition-colors duration-300 text-lg"
    >
      {children}
    </Link>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#222222] text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Logo i informacje */}
          <div className="space-y-6">
            <Link href="/">
              <Image 
                src={ASSET_PATHS.logoWhite} 
                alt="ASCANA Logo" 
                width={200} 
                height={70} 
                className="mb-4"
              />
            </Link>
            <p className="text-gray-300 text-lg">
              Tworzymy nowoczesne i komfortowe przestrzenie mieszkalne, łącząc najwyższą jakość wykonania z dbałością o detale.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://www.facebook.com/ascanadeveloper/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#b39a65] hover:bg-[#a38a55] transition-all duration-300 w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebookF size={18} />
              </a>
            </div>
          </div>

          {/* Nawigacja */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              Nawigacja
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#b39a65]"></span>
            </h3>
            <ul className="space-y-4">
              <li>
                <FooterNavLink href="/">
                  Strona główna
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="#wybierz-dom">
                  Wybierz dom
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="#kontakt">
                  Kontakt
                </FooterNavLink>
              </li>
              <li>
                <FooterNavLink href="/polityka-prywatnosci">
                  Polityka prywatności
                </FooterNavLink>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              Kontakt
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#b39a65]"></span>
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <FaPhone className="text-[#b39a65] mt-1 mr-3 text-lg scale-x-[-1]" />
                <div>
                  <p className="text-gray-300">Telefon</p>
                  <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="text-white hover:text-[#b39a65] transition-colors duration-300 text-lg font-medium">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="text-[#b39a65] mt-1 mr-3 text-lg" />
                <div>
                  <p className="text-gray-300">Email</p>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="text-white hover:text-[#b39a65] transition-colors duration-300 text-lg font-medium">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </li>
              <li>
                <p className="text-gray-300">Adres inwestycji</p>
                <address className="not-italic text-white text-lg font-medium">
                  ul. Jana Zamoyskiego<br />
                  37-450 Stalowa Wola
                </address>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Dolny pasek */}
      <div className="border-t border-[#333333]">
        <div className="container-custom py-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-base">
            &copy; {currentYear} ASCANA Sp. z o.o. Wszelkie prawa zastrzeżone.
          </p>
          <div className="mt-4 md:mt-0">
            <FooterNavLink href="/polityka-prywatnosci">
              Polityka prywatności
            </FooterNavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;