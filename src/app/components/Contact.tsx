'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';

const Contact = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  // Usunięto stan formularza

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

  // Usunięto obsługę formularza

  return (
    <section id="kontakt" className="pt-32 pb-20 bg-white">
      <div className="container-custom">
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="flex flex-col items-center mb-12">
            <motion.span 
              variants={itemVariants}
              className="text-[#c5ab75] font-medium uppercase tracking-wider mb-3"
            >
              SKONTAKTUJ SIĘ Z NAMI
            </motion.span>
            
            <motion.h2 
              variants={itemVariants} 
              className="section-heading text-center mb-6"
            >
              Kontakt
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-center text-lg max-w-3xl mx-auto"
            >
              Masz pytania dotyczące naszych inwestycji? Skontaktuj się z nami. Nasz zespół jest do Twojej dyspozycji.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Lewa kolumna - Informacje kontaktowe */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="bg-gray-50 p-8 rounded-xl shadow-lg border border-gray-100 h-full">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FaBuilding className="text-[#c5ab75] mr-2" />
                  Dane firmy
                </h3>
                <div className="space-y-4">
                  <p className="flex items-start">
                    <span className="text-[#c5ab75] font-semibold mr-2">Nazwa:</span>
                    <span>ASCANA Sp. z o.o.</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-[#c5ab75] font-semibold mr-2">Adres:</span>
                    <span>ul. Wojska Polskiego 3, 39-300 Mielec</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-[#c5ab75] font-semibold mr-2">NIP:</span>
                    <span>6762515504</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-[#c5ab75] font-semibold mr-2">REGON:</span>
                    <span>365693032</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-white p-6 rounded-lg flex flex-col items-center text-center hover:bg-[#c5ab75]/5 transition-all duration-300">
                    <div className="bg-[#c5ab75]/10 p-3 rounded-full mb-3">
                      <FaPhone className="text-[#c5ab75] text-xl scale-x-[-1]" />
                    </div>
                    <h4 className="font-semibold mb-1">Telefon</h4>
                    <a href="tel:+48516516440" className="text-[#c5ab75] hover:underline">+48 516 516 440</a>
                  </div>

                  <div className="bg-white p-6 rounded-lg flex flex-col items-center text-center hover:bg-[#c5ab75]/5 transition-all duration-300">
                    <div className="bg-[#c5ab75]/10 p-3 rounded-full mb-3">
                      <FaEnvelope className="text-[#c5ab75] text-xl" />
                    </div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <a href="mailto:biuro@ascana.pl" className="text-[#c5ab75] hover:underline">biuro@ascana.pl</a>
                  </div>

                  <div className="bg-white p-6 rounded-lg flex flex-col items-center text-center hover:bg-[#c5ab75]/5 transition-all duration-300">
                    <div className="bg-[#c5ab75]/10 p-3 rounded-full mb-3">
                      <FaMapMarkerAlt className="text-[#c5ab75] text-xl" />
                    </div>
                    <h4 className="font-semibold mb-1">Lokalizacja</h4>
                    <p>Mielec, Polska</p>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Prawa kolumna - Mapa */}
            <motion.div 
              variants={itemVariants}
              className="rounded-xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 h-full min-h-[300px]"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.0922848001!2d21.4219523!3d50.2874339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473d6f3f5e5a0e7d%3A0x4f4c7f9d6c0f2f9b!2sWojska%20Polskiego%203%2C%2039-300%20Mielec!5e0!3m2!1spl!2spl!4v1630000000000!5m2!1spl!2spl" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa lokalizacji ASCANA"
              ></iframe>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
