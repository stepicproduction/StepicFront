import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import photo2 from "@/assets/photo2.webp";
import header1 from "@/assets/header1.webp";
import header2 from "@/assets/header2.webp";
import header3 from "@/assets/header3.webp";
import header4 from "@/assets/header4.webp";
import header5 from "@/assets/header5.webp";

function HeaderSection() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);


  // ---- ANIMATIONS INVERSÉES (Ordre : Boutons -> Sous-titre -> Titre) ----
  
  // 3. Le titre apparaît en dernier (Délai le plus long)
  const titleVariant = {
    hidden: { opacity: 0, x: -50 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.4 }, 
    },
  };

  // 2. Le sous-titre apparaît en deuxième (Délai moyen)
  const subtitleVariant = {
    hidden: { opacity: 0, x: -30 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.8 }, 
    },
  };

  // 1. Les boutons apparaissent en PREMIER (Délai le plus court)
  const btnContainerVariant = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.1 }, 
    },
  };

  // ---- SLIDESHOW BACKGROUND (Inchangé) ----
  const images = [photo2, header1, header2, header3, header4, header5];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const bgVariants = {
    initial: { opacity: 0, scale: 1.05 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.5, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 1.5, ease: "easeInOut" },
    },
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center px-6 sm:px-12 lg:px-32 overflow-hidden"
    >
      {/* BACKGROUND PARALLAX & SLIDESHOW */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center will-change-transform"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImage}
            variants={bgVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${images[currentImage]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {currentImage === 0 && (
              <img src={images[0]} alt="" className="hidden" fetchpriority="high" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* OVERLAY DÉGRADÉ LATÉRAL */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-1"></div>

      {/* CONTENT ALIGNÉ À GAUCHE */}
      <div className="relative z-10 w-full sm:max-w-4xl text-left">
        
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }} // Apparaît après le titre pour conclure
          className="inline-block text-purple-400 font-bold tracking-[0.3em] uppercase text-xs sm:text-sm mb-2 sm:mb-4"
        >
          FORMATIONS & SERVICES MULTIDISCIPLINAIRES
        </motion.span>

        {/* TITRE (Apparaît en 3ème) */}
        <motion.h1
          variants={titleVariant}
          initial="hidden"
          animate="show"
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1] sm:leading-[1.2] drop-shadow-xl"
        >
          STEPIC, booster des talents : Informatique, Langues et création <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Multimédia</span>.
        </motion.h1>

        {/* SOUS-TITRE (Apparaît en 2ème) */}
        <motion.p
          variants={subtitleVariant}
          initial="hidden"
          animate="show"
          className="text-lg sm:text-xl text-gray-200 mb-10 italic max-w-2xl border-l-4 border-purple-600 pl-6 sm:py-2"
        >
          <span className="hidden md:block text-4xl text-purple-400 font-serif">“</span>Langues · Informatique · Multimédia <br /> Communication · Presse · Évènementiel <span className="hidden md:block text-4xl text-purple-400 font-serif">”</span>
        </motion.p>

        {/* BOUTONS (Apparaissent en 1er) */}
        <motion.div 
          variants={btnContainerVariant}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-start gap-5 w-full sm:w-auto pb-2"
        >
          <button
            onClick={() => navigate("/commande")}
            className="group relative flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 hover:scale-105 hover:bg-purple-700 active:scale-95 cursor-pointer h-12 sm:h-auto"
          >
            Commander
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <ScrollLink
            to="showreel"
            smooth={true}
            duration={2000}
            offset={-60}
            href="#showreel"
            className="flex items-center justify-center px-8 py-4 rounded-full text-white border-2 border-white/40 font-bold backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white cursor-pointer active:scale-95 h-12 sm:h-auto"
          >
            Voir démonstration
          </ScrollLink>
        </motion.div>
      </div>
    </section>
  );
}

export default HeaderSection;