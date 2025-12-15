"use client";

import React, { useState, useEffect } from "react";
import { H2 } from "@/components/Typographie";
import { getData } from "@/service/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Fonction pour boucler l'index
const wrapIndex = (min, max, val) => {
  const range = max - min;
  return ((val - min) % range + range) % range + min;
};

const ProjetSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [projets, setProjets] = useState([]);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getData("projets/");
        setProjets(response.data);
      } catch (err) {
        setProjets([]);
      }
    };
    fetchProject();
  }, []);

  // =======================  DESKTOP CAROUSEL  =======================
  const DesktopCarousel = () => {
    if (!projets.length) return null;

    const total = projets.length;
    const items = [
      projets[desktopIndex],
      projets[(desktopIndex + 1) % total],
      projets[(desktopIndex + 2) % total],
    ];

    const goPrev = () => {
      setDirection(-1);
      setDesktopIndex(wrapIndex(0, total, desktopIndex - 3));
    };

    const goNext = () => {
      setDirection(1);
      setDesktopIndex(wrapIndex(0, total, desktopIndex + 3));
    };

    return (
      <div className="relative w-full flex justify-center items-center py-10">
        <button
          onClick={goPrev}
          className="absolute left-4 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 
                     bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] p-2 rounded-full 
                     shadow-xl transition-all hover:scale-110 z-20"
        >
          <ChevronLeft className="text-white w-7 h-7" />
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={desktopIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 150 }}
            animate={{ opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 15, duration: 0.3 } }}
            exit={{ opacity: 0, x: direction * -150, transition: { type: "spring", stiffness: 200, damping: 15, duration: 0.3 } }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            {items.map((projet, index) => (
              <div
                key={index}
                className="group relative w-[280px] md:w-[330px] h-[400px] rounded-2xl shadow-xl overflow-hidden cursor-pointer mx-auto hover:scale-105 transition-transform"
                style={{
                  backgroundImage: `url(${projet.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-blue-900/30 group-hover:bg-blue-900/60 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center bg-blue-900/70 p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-base">{projet.description_projet}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={goNext}
          className="absolute right-4 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 
                     bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] p-2 rounded-full 
                     shadow-xl transition-all hover:scale-110 z-20"
        >
          <ChevronRight className="text-white w-7 h-7" />
        </button>
      </div>
    );
  };

  // =======================  MOBILE SLIDER =======================
  const MobileSlider = () => {
    if (!projets.length) return null;
    return (
      <div className="mt-10 relative w-full flex justify-center items-center">
        <UsePresenceDataImages projets={projets} />
      </div>
    );
  };

  return (
    <section id="projets" className="w-full py-30 text-white overflow-hidden">
      <H2 className="text-center text-lg sm:text-xl md:text-3xl mb-10">
        Nos projets
      </H2>
      {isMobile ? <MobileSlider /> : <DesktopCarousel />}
    </section>
  );
};

export default ProjetSection;

// =================== MOBILE SLIDER ANIMATION ===================
const UsePresenceDataImages = ({ projets }) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showDescription, setShowDescription] = useState(false);

  const setSlide = (newDirection) => {
    const nextItem = wrapIndex(0, projets.length, selectedItem + newDirection);
    setDirection(newDirection);
    setSelectedItem(nextItem); // immédiat pour animation réactive
    setShowDescription(false);
  };

  const projet = projets[selectedItem];

  return (
    <div className="relative flex items-center justify-center gap-4 w-full">

      {/* Flèche gauche */}
      <motion.button
        onClick={() => setSlide(-1)}
        className="bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] p-2 rounded-full shadow-xl hover:scale-110 transition-transform"
      >
        <ChevronLeft className="text-white w-6 h-6" />
      </motion.button>

      {/* Image projet carrée */}
      <AnimatePresence custom={direction} initial={false} mode="wait">
        <motion.div
          key={selectedItem}
          custom={direction}
          initial={{ opacity: 0, x: direction * 200 }}
          animate={{ opacity: 1, x: 0, transition: { type: "spring", stiffness: 220, damping: 15, duration: 0.2 } }}
          exit={{ opacity: 0, x: direction * -200, transition: { type: "spring", stiffness: 220, damping: 15, duration: 0.2 } }}
          className="relative w-[300px] h-[300px] shadow-xl overflow-hidden cursor-pointer rounded-xl"
          style={{
            backgroundImage: `url(${projet.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => setShowDescription(!showDescription)}
        >
          <div className="absolute inset-0 bg-blue-900/40" />
          <div
            className={`absolute inset-0 flex items-center justify-center bg-blue-900/70 p-4 text-center transition-opacity duration-300 ${
              showDescription ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <p className="text-sm sm:text-base text-white leading-relaxed">{projet.description_projet}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Flèche droite */}
      <motion.button
        onClick={() => setSlide(1)}
        className="bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] p-2 rounded-full shadow-xl hover:scale-110 transition-transform"
      >
        <ChevronRight className="text-white w-6 h-6" />
      </motion.button>

    </div>
  );
};
