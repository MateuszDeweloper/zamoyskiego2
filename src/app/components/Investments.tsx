'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaBuilding } from 'react-icons/fa';

interface Investment {
  id: string;
  name: string;
  location: string;
  status: 'current' | 'archived';
  image: string;
  url: string;
  description: string;
  details?: {
    area?: string;
    units?: string;
    completion?: string;
    features?: string[];
  };
}

const investments: Investment[] = [
  {
    id: 'zamoyskiego2',
    name: 'Osiedle Zamoyskiego 2',
    location: 'Stalowa Wola, ul. Jana Zamoyskiego',
    status: 'current',
    image: '/Image15_000.png',
    url: 'https://zamoyskiego2.ascana.pl',
    description: 'Druga faza popularnej inwestycji przy ul. Jana Zamoyskiego w Stalowej Woli. Nowoczesne domy w zabudowie szeregowej z prywatnymi ogródkami. Doskonała lokalizacja i wysoki standard wykończenia.',
    details: {
      area: '2500 m²',
      units: '13 lokali',
      completion: 'II kwartał 2024',
      features: ['Prywatne ogródki', 'Miejsca parkingowe', 'Energooszczędne rozwiązania', 'Wysoki standard wykończenia']
    }
  },
  {
    id: 'zamoyskiego',
    name: 'Osiedle Zamoyskiego',
    location: 'Stalowa Wola, ul. Jana Zamoyskiego 18-18K',
    status: 'archived',
    image: '/Image13_000.png',
    url: 'https://zamoyskiego.ascana.pl',
    description: 'Kameralne osiedle domów jednorodzinnych w zabudowie szeregowej przy ul. Jana Zamoyskiego 18-18K w Stalowej Woli. Pierwsza inwestycja zrealizowana w Stalowej Woli.',
    details: {
      area: '1800 m²',
      units: '8 segmentów (16 mieszkań)',
      completion: 'Zrealizowane (2022)',
      features: ['Prywatne ogródki', 'Miejsca parkingowe', 'Bliskość szkół i przedszkoli']
    }
  },
  {
    id: 'modelarska',
    name: 'Osiedle Modelarska',
    location: 'Mielec, ul. Modelarska 1-3',
    status: 'archived',
    image: '/Image17_000.png',
    url: 'https://modelarska.ascana.pl',
    description: 'Kompleks nowoczesnych mieszkań przy ul. Modelarskiej 1-3 w Mielcu. Komfortowe mieszkania w spokojnej dzielnicy z pełną infrastrukturą miejską, blisko centrum miasta.',
    details: {
      area: '3200 m²',
      units: '24 mieszkania',
      completion: 'Zrealizowane (2020)',
      features: ['Podziemny garaż', 'Winda', 'Monitoring', 'Plac zabaw']
    }
  }
];

const Investments = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  // Usunięto stan activeTab

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const currentInvestments = investments.filter(inv => inv.status === 'current');
  const archivedInvestments = investments.filter(inv => inv.status === 'archived');

  return (
    <section id="inwestycje" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Elementy dekoracyjne */}
      <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-[#c5ab75]/5 rounded-bl-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#c5ab75]/5 rounded-tr-full -z-10"></div>
      
      <div className="container-custom">
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="text-center mb-16">
            <div className="flex flex-col items-center">
              <motion.span 
                variants={itemVariants}
                className="text-[#c5ab75] font-medium uppercase tracking-wider mb-3"
              >
                NASZE REALIZACJE
              </motion.span>
              
              <motion.h2 
                variants={itemVariants} 
                className="section-heading text-center mb-6"
              >
                Inwestycje
              </motion.h2>
            </div>
            
            <motion.p 
              variants={itemVariants}
              className="text-center text-lg mb-12 max-w-3xl mx-auto"
            >
              Odkryj nasze aktualne i archiwalne inwestycje mieszkaniowe. Każdy projekt to połączenie nowoczesnej architektury, funkcjonalności i najwyższej jakości wykonania.
            </motion.p>
          </div>

          {/* Aktualne inwestycje */}
          <motion.div variants={itemVariants} className="mb-20">
            <div className="flex justify-center mb-10">
              <h3 className="text-2xl font-bold relative inline-block text-center">
                Inwestycje aktualne
                <span className="absolute bottom-0 left-1/4 right-1/4 w-1/2 h-0.5 bg-[#c5ab75] mx-auto"></span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
              {currentInvestments.map((investment) => (
                <InvestmentCard 
                  key={investment.id} 
                  investment={investment} 
                  onSelect={() => {}}
                />
              ))}
            </div>
          </motion.div>

          {/* Archiwalne inwestycje */}
          <motion.div variants={itemVariants}>
            <div className="flex justify-center mb-10">
              <h3 className="text-2xl font-bold relative inline-block text-center">
                Inwestycje zrealizowane
                <span className="absolute bottom-0 left-1/4 right-1/4 w-1/2 h-0.5 bg-[#c5ab75] mx-auto"></span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
              {archivedInvestments.map((investment) => (
                <InvestmentCard 
                  key={investment.id} 
                  investment={investment} 
                  onSelect={() => {}}
                />
              ))}
            </div>
          </motion.div>

          {/* Usunięto modal ze szczegółami inwestycji */}
        </motion.div>
      </div>
    </section>
  );
};

const InvestmentCard = ({ investment, onSelect }: { investment: Investment; onSelect: () => void }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="relative h-64 sm:h-72">
        <Image
          src={investment.image}
          alt={investment.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute top-4 left-4 bg-[#c5ab75] text-white px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
          <FaMapMarkerAlt className="mr-1" size={12} />
          {investment.location}
        </div>
        {investment.status === 'current' && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
            <FaCalendarAlt className="mr-1" size={12} />
            Aktualna
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-xl font-bold">{investment.name}</h4>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FaBuilding className="mr-1" />
            {investment.details?.units?.split(' ')[0]}
          </div>
        </div>
        
        <p className="text-gray-600 mb-6 line-clamp-3">
          {investment.description}
        </p>
        
        <div className="flex justify-center">
          <Link 
            href="#"
            className="bg-[#c5ab75] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b39a65] transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center"
          >
            PRZEJDŹ DO INWESTYCJI
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Investments;
