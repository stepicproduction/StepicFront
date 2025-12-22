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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showDescription, setShowDescription] = useState(false);

  // Détecte si mobile ou desktop
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fetch projets depuis API
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

  // Navigation
  const goPrev = () => {
    setDirection(-1);
    setSelectedIndex(wrapIndex(0, projets.length, selectedIndex - 1));
    setShowDescription(false);
  };

  const goNext = () => {
    setDirection(1);
    setSelectedIndex(wrapIndex(0, projets.length, selectedIndex + 1));
    setShowDescription(false);
  };

  // ======================= DESKTOP CAROUSEL =======================
  const DesktopCarousel = () => {
    if (!projets.length) return null;

    const total = projets.length;
    const items = [
      projets[selectedIndex],
      projets[(selectedIndex + 1) % total],
      projets[(selectedIndex + 2) % total],
    ];

    return (
      <div className="relative w-full flex justify-center items-center py-10 overflow-hidden">
        {/* Flèche gauche */}
        <button
          onClick={goPrev}
          className="absolute left-4 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 
                     bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] p-2 rounded-full 
                     shadow-xl transition-all hover:scale-110 z-20"
        >
          <ChevronLeft className="text-white w-7 h-7" />
        </button>

        {/* Grid de 3 cartes avec animation fluide */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={selectedIndex}
            custom={direction}
            initial={{ x: direction * 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 25 } }}
            exit={{ x: direction * -300, opacity: 0, transition: { type: "spring", stiffness: 200, damping: 25 } }}
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
                {/* Overlay hover desktop */}
                <div className="absolute inset-0 bg-blue-900/30 group-hover:bg-blue-900/60 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center bg-blue-900/70 p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-base">{projet.description_projet}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Flèche droite */}
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

  // ======================= MOBILE SLIDER =======================
        const MobileSlider = () => {
        if (!projets.length) return null;
        const projet = projets[selectedIndex];

        return (
          <div className="mt-10 relative w-full flex justify-center items-center">
            {/* Flèche gauche */}
            <motion.button
              aria-label="précédent"
              onClick={goPrev}
              className="absolute left-1 sm:left-4 md:left-6 top-1/2 -translate-y-1/2
                        bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] p-2 rounded-full 
                        shadow-xl hover:scale-110 transition-transform z-20"
            >
              <ChevronLeft className="text-white w-6 h-6" />
            </motion.button>

            {/* Image projet carrée avec animation fluide */}
            <AnimatePresence custom={direction} initial={false} mode="wait">
              <motion.div
                key={selectedIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction * 300, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 250, damping: 20 } }}
                exit={{ opacity: 0, x: direction * -300, scale: 0.9, transition: { type: "spring", stiffness: 250, damping: 20 } }}
                className="relative w-[300px] h-[300px] shadow-xl overflow-hidden cursor-pointer rounded-xl mx-auto flex-shrink-0"
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
                  <p className="text-white text-sm sm:text-base">{projet.description_projet}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Flèche droite */}
            <motion.button
              aria-label="suivant"
              onClick={goNext}
              className="absolute right-1 sm:right-4 md:right-6 top-1/2 -translate-y-1/2
                        bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] p-2 rounded-full 
                        shadow-xl hover:scale-110 transition-transform z-20"
            >
              <ChevronRight className="text-white w-6 h-6" />
            </motion.button>
          </div>
        );
      };


  return (
    <motion.section id="projets" className="w-full sticky top-0 z-10 min-h-screen transition-all bg-white">
      <div className="py-10 md:py-20">
        <H2 className="text-center text-lg sm:text-xl md:text-3xl mb-10">
          Nos réalisations
        </H2>
        <div className="max-w-7xl mx-auto relative px-5 md:px-36">
          <span className="hidden md:block absolute top-0 left-25 text-8xl text-purple-400 font-serif">“</span>
          <span className="md:hidden absolute top-0 left-0 text-5xl text-purple-400 font-serif">“</span>
          <p className="text-sm sm:text-base text-black leading-relaxed sm:leading-loose text-justify">Chaque projet est une nouvelle occasion de repousser nos limites. De la conception à la livraison finale, nous transformons vos défis en succès mesurables. Ces réalisations témoignent de notre engagement envers la qualité et de notre capacité à donner vie à des visions ambitieuses, quel que soit le domaine d'intervention.</p>
          <span className="hidden md:block absolute bottom-0 right-25 text-8xl text-purple-400 font-serif">”</span>
          <span className="md:hidden absolute -bottom-5 right-0 text-5xl text-purple-400 font-serif">”</span>
        </div>
        {isMobile ? <MobileSlider /> : <DesktopCarousel />}
      </div>
    </motion.section>
  );
};

export default ProjetSection;
