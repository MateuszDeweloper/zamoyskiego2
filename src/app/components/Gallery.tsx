'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import ImagePopup from './ImagePopup';
import { ASSET_PATHS } from '@/lib/assets';

const galleryImages = [
  ASSET_PATHS.photos.image13_000,
  ASSET_PATHS.photos.image13_001,
  ASSET_PATHS.photos.image13_002,
  ASSET_PATHS.photos.image15_000,
  ASSET_PATHS.photos.image17_000,
  ASSET_PATHS.photos.image19_000,
  ASSET_PATHS.photos.image20_000,
  ASSET_PATHS.photos.image21_000,
  ASSET_PATHS.photos.image23_000,
  ASSET_PATHS.photos.image24_000,
];

const Gallery = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  const openPopup = (index: number) => {
    setCurrentImageIndex(index);
    setIsPopupOpen(true);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
    resetZoom();
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
    resetZoom();
  };

  const zoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.25, 3));
  };

  const zoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.25, 1));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section id="galeria" className="py-24 bg-white dark:bg-[#1a1a1a]">
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
              NASZE REALIZACJE
            </motion.span>
            
            <motion.h2 
              variants={itemVariants} 
              className="section-heading text-center mb-6 text-gray-100"
            >
              Galeria
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-center text-lg max-w-3xl mx-auto text-gray-100"
            >
              Zobacz wizualizacje przygotowane dla naszych osiedli. Zwróć uwagę na detale i jakość wykończenia inwestycji.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative overflow-hidden rounded-lg shadow-md aspect-[4/3] cursor-pointer group"
                onClick={() => openPopup(index)}
              >
                <Image
                  src={image}
                  alt={`Galeria ASCANA ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-[#b39a65] text-white rounded-full w-12 h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <ImagePopup
        isOpen={isPopupOpen}
        images={galleryImages}
        currentIndex={currentImageIndex}
        onClose={closePopup}
        onNext={nextImage}
        onPrev={prevImage}
        zoomLevel={zoomLevel}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        isDragging={isDragging}
        position={position}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </section>
  );
};

export default Gallery;
