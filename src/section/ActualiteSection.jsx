import React, { useEffect, useState } from 'react';
import { H2 } from '@/components/Typographie';
import actualite1 from "../assets/bg_presse.webp";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

function ActualiteSection() {
  const navigate = useNavigate(); 
  const [isVisible, setIsVisible] = useState(false);

  // Observer pour déclencher l'animation au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    const section = document.getElementById('actualite');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  // Variantes Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 1, ease: 'easeOut' } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 1, ease: 'easeOut', delay: 0.2 } },
  };

  return (
    <motion.div
      id="actualite"
      className="py-10 px-4 sm:px-8 md:py-20 md:px-32 max-w-7xl mx-auto overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {/* Section titre + bouton */}
      <div className="relative flex flex-col items-center justify-center text-center mb-20">
        <H2 className="text-center mb-6">{/* Animate if needed */}Actualités</H2>
        <div className="w-full flex justify-end">
          <button
            onClick={() => navigate("/presse_actu")}
            className="px-6 py-2 rounded-full text-[#0B1D5D] border border-[#0B1D5D] hover:bg-[#0B1D5D] hover:text-white font-semibold shadow-lg transition-all duration-300 cursor-pointer text-sm md:text-base whitespace-nowrap h-14 md:h-12 mt-2 sm:mt-3"
          >
            Voir toutes les actualités
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 sm:px-6 md:px-12 mb-20 lg:mb-32">
        <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-20">

          {/* Image */}
          <motion.div variants={imageVariants} className="w-full xl:w-1/2 flex justify-center group">
            <div className="relative w-[350px] h-[350px] md:w-[400px] md:h-[400px] overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-700 hover:scale-[1.07] hover:shadow-3xl hover:-translate-y-2">
              <img
                src={actualite1}
                alt="Équipe de tournage en action"
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></div>
            </div>
          </motion.div>

          {/* Texte */}
          <motion.div variants={textVariants} className="w-full mt-10 xl:mt-0 flex justify-center items-center">
            <div className="w-full max-w-md md:max-w-lg rounded-2xl shadow-xl p-[2px] bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] h-auto">
              <div className="bg-white w-full h-full rounded-2xl flex flex-col justify-center p-6 sm:p-8">
                <div className="text-black px-2">
                  <h3 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight text-center">
                    STEPIC — Presse
                  </h3>
                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed text-left">
                    Restez connectés avec{" "}
                    <span className="font-extrabold bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] text-transparent bg-clip-text">
                      STEPIC
                    </span>, là où savoir et créativité se rencontrent ! Chaque jour, plongez au cœur des tendances, des innovations et des actualités qui façonnent le monde numérique et créatif. Avec{" "}
                    <span className="font-extrabold bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] text-transparent bg-clip-text">
                      STEPIC
                    </span>, transformez vos idées en compétences et vos passions en réussites.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

export default ActualiteSection;
