'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { FaHome, FaTree, FaShieldAlt, FaWifi, FaParking, FaLeaf } from 'react-icons/fa';

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <FaHome className="text-[#b39a65] text-3xl" />,
      title: "Nowoczesna architektura",
      description: "Elegancki i funkcjonalny design domów w zabudowie szeregowej z wysokiej jakości materiałami wykończeniowymi."
    },
    {
      icon: <FaTree className="text-[#b39a65] text-3xl" />,
      title: "Zielone otoczenie",
      description: "Starannie zaprojektowana zieleń wokół osiedla zapewniająca harmonię z naturą i przestrzeń do wypoczynku."
    },
    {
      icon: <FaShieldAlt className="text-[#b39a65] text-3xl" />,
      title: "Bezpieczeństwo",
      description: "Kameralne osiedle zapewniające poczucie bezpieczeństwa i prywatności dla wszystkich mieszkańców."
    },
    {
      icon: <FaWifi className="text-[#b39a65] text-3xl" />,
      title: "Smart rozwiązania",
      description: "Możliwość implementacji nowoczesnych rozwiązań technologicznych dla większego komfortu życia."
    },
    {
      icon: <FaParking className="text-[#b39a65] text-3xl" />,
      title: "Miejsca parkingowe",
      description: "Dedykowane miejsca parkingowe dla każdego lokalu, zapewniające wygodę i porządek na osiedlu."
    },
    {
      icon: <FaLeaf className="text-[#b39a65] text-3xl" />,
      title: "Energooszczędność",
      description: "Zastosowanie technologii i materiałów zapewniających niskie koszty eksploatacji i dbałość o środowisko."
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="atuty" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Atuty <span className="text-[#b39a65]">inwestycji</span>
          </h2>
          <div className="w-24 h-1 bg-[#b39a65] mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Zamoyskiego 2 to więcej niż miejsce zamieszkania - to przestrzeń stworzona z myślą o komforcie i jakości życia.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-[#b39a65]/10 p-4 rounded-full inline-block mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-white p-8 rounded-lg shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Specyfikacja techniczna</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#b39a65] mr-2">✓</span>
                  <span>Konstrukcja budynku z wysokiej jakości materiałów</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#b39a65] mr-2">✓</span>
                  <span>Nowoczesna stolarka okienna o podwyższonych parametrach izolacyjności</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#b39a65] mr-2">✓</span>
                  <span>Efektywny system ogrzewania zapewniający niskie koszty eksploatacji</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#b39a65] mr-2">✓</span>
                  <span>Starannie wykonane instalacje elektryczne i wodno-kanalizacyjne</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#b39a65] mr-2">✓</span>
                  <span>Funkcjonalny układ pomieszczeń z optymalnym wykorzystaniem przestrzeni</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#b39a65] mr-2">✓</span>
                  <span>Indywidualne miejsca parkingowe dla każdego lokalu</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={require('@/lib/assets').ASSET_PATHS.photos.image17}
                  alt="Zamoyskiego 2 - Wizualizacja"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#b39a65]/10 rounded-full z-0"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
