import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { H2, P } from '@/components/Typographie';
import aboutResume from '../assets/aboutResume.png';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getData } from '@/service/api';

const PRIMARY_PURPLE = '#6c63ff';
const DARK_PURPLE = '#8a2be2';

function AboutSection() {
  const [about, setAbout] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Fetch API
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await getData("/about/");
        console.log(response.data)
        setAbout(response.data);
      } catch (err) {
        console.error("Erreur GET :", err);
      }
    };
    fetchAbout();
  }, []);

  const item = about.find(item => item.id === 1) || {};
  const words = item.contenu ? item.contenu.split(" ") : [];
  //console.log(words)

  // Intersection Observer pour déclencher les animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    const section = document.getElementById('about');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  // ---- Variants pour Framer Motion ----
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 50, y: 20 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.5, duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.div
      id="about"
      className="relative py-10 px-4 sm:px-6 md:px-16 lg:px-32 w-full bg-cover bg-center"
      
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {/* TITRE */}
      <motion.div
        className="text-center mb-10 sm:mb-14 md:mb-20"
        variants={titleVariants}
      >
        <H2 className="text-2xl sm:text-3xl md:text-4xl text-[#6c63ff] leading-relaxed font-semibold">
          Qui sommes-nous ?
        </H2>
      </motion.div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 md:gap-16 place-items-center">

        {/* IMAGE */}
        <motion.div
          className="col-span-12 lg:col-span-6 w-full flex justify-center px-2"
          variants={imageVariants}
        >
          <div
            className={`p-[3px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-tr from-[${DARK_PURPLE}] to-[${PRIMARY_PURPLE}] w-full max-w-[350px] sm:max-w[450px] lg:max-w-[500px]`}
          > 
            <motion.div
              className="w-full h-full rounded-[calc(1.5rem-3px)] overflow-hidden bg-white"
              whileHover={{ scale: 1.05, rotateY: 3, transition: { duration: 0.3 } }}
            >
              <img
                src={aboutResume}
                alt="À propos"
                className="w-full h-auto object-cover block"
                loading="lazy"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* TEXTE */}
        <motion.div
          className="col-span-12 lg:col-span-6 text-center lg:text-left px-2"
          variants={contentVariants}
        >
          
            {words.length > 0 ? (
              <div className="flex flex-wrap text-justify"> {/* Conteneur pour gérer l'alignement */}
              {words.map((word, index) => (
                <motion.p
                  key={index}
                  // Changement : 'leading-snug' pour moins d'espace vertical et 'mr-1.5' pour l'espace entre mots
                  className='text-sm sm:text-base text-black leading-relaxed sm:leading-loose text-justify inline-block mr-1.5'
                  initial={{ filter: 'blur(10px)', opacity: 0, y: 12 }}
                  animate={{ filter: 'blur(0)', opacity: 1, y: 0}}
                  transition={{ delay: index * 0.1, duration: 0.5 }} // Délai réduit pour plus de fluidité
                >
                  {word}
          </motion.p>
              ))}
            </div>
          ) : (
            <p className='text-black text-sm sm:text-base'>Chargement du contenu...</p>
          )}

          {/* BOUTON */}
          <motion.div
            className="flex justify-center lg:justify-start pt-8"
            variants={buttonVariants}
          >
            <Button
              variant="ghost"
              size="default"
              onClick={() => navigate("/about")}
              whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-6 py-2 rounded-full text-[#0B1D5D] border border-[#0B1D5D] hover:bg-[#0B1D5D] hover:text-white font-semibold shadow-lg transition-all duration-300 h-10 w-40 md:h-12 md:w-48 cursor-pointer"
            >
              Lire plus
            </Button>
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
}

export default AboutSection;
