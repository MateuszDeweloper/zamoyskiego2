'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { FaLeaf, FaShieldAlt, FaStar } from 'react-icons/fa';

const AboutUs = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="o-nas" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            O inwestycji <span className="text-[#b39a65]">Zamoyskiego 2</span>
          </h2>
          <div className="w-24 h-1 bg-[#b39a65] mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Odkryj wyjątkowe miejsce do życia w Stalowej Woli, gdzie komfort spotyka się z nowoczesnym designem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-lg overflow-hidden shadow-xl">
              <Image
                src={require('@/lib/assets').ASSET_PATHS.photos.image19}
                alt="Zamoyskiego 2 - Wizualizacja"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#b39a65]/10 rounded-full z-0"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#b39a65]/10 rounded-full z-0"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-6">Komfortowe życie w sercu Stalowej Woli</h3>
            <p className="text-gray-600 mb-6">
              Inwestycja Zamoyskiego 2 to nowoczesny kompleks 26 domów w zabudowie szeregowej, zlokalizowany przy ul. Jana Zamoyskiego 18-18K w Stalowej Woli. Projekt łączy w sobie funkcjonalność, elegancję i komfort, oferując mieszkańcom przestrzeń idealnie dostosowaną do współczesnego stylu życia.
            </p>
            <p className="text-gray-600 mb-8">
              Każdy lokal o powierzchni 56-59 m² został starannie zaprojektowany, aby zapewnić maksymalny komfort i wykorzystanie przestrzeni. Domy wyróżniają się nowoczesną architekturą, wysokiej jakości materiałami wykończeniowymi oraz przemyślanym układem pomieszczeń.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-[#b39a65]/10 p-3 rounded-full mr-4">
                  <FaLeaf className="text-[#b39a65] text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Ekologiczne rozwiązania</h4>
                  <p className="text-gray-600 text-sm">
                    Inwestycja wykorzystuje energooszczędne technologie i materiały przyjazne dla środowiska.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#b39a65]/10 p-3 rounded-full mr-4">
                  <FaShieldAlt className="text-[#b39a65] text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Bezpieczeństwo i prywatność</h4>
                  <p className="text-gray-600 text-sm">
                    Kameralne osiedle zapewnia mieszkańcom poczucie bezpieczeństwa i prywatności.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#b39a65]/10 p-3 rounded-full mr-4">
                  <FaStar className="text-[#b39a65] text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Wysoki standard wykończenia</h4>
                  <p className="text-gray-600 text-sm">
                    Materiały najwyższej jakości i dbałość o detale gwarantują trwałość i estetykę.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 bg-gray-50 p-8 rounded-lg shadow-sm"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Doskonała lokalizacja</h3>
          <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Inwestycja Zamoyskiego 2 znajduje się w atrakcyjnej części Stalowej Woli, zapewniającej łatwy dostęp do kluczowych punktów miasta, a jednocześnie oferującej spokój i ciszę.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-lg mb-3">Infrastruktura</h4>
              <p className="text-gray-600 text-sm">
                W pobliżu znajdują się szkoły, przedszkola, sklepy, przychodnie i inne niezbędne punkty usługowe.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-lg mb-3">Komunikacja</h4>
              <p className="text-gray-600 text-sm">
                Dogodny dostęp do głównych arterii komunikacyjnych miasta oraz transportu publicznego.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-lg mb-3">Rekreacja</h4>
              <p className="text-gray-600 text-sm">
                Bliskość terenów zielonych, parków i obiektów sportowo-rekreacyjnych zapewnia możliwość aktywnego wypoczynku.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
