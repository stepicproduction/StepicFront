import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { motion, AnimatePresence, useInView, useTransform, useScroll } from "framer-motion";

// Importations d'images
import photo2 from "@/assets/photo2.webp";
import header1 from "@/assets/header1.webp";
import header2 from "@/assets/header2.webp";
import header3 from "@/assets/header3.webp";
import header4 from "@/assets/header4.webp";
import header5 from "@/assets/header5.webp";

// 1. Sortir les données statiques du composant pour éviter la recréation
const IMAGES = [photo2, header1, header2, header3, header4, header5];

const BG_VARIANTS = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0.2, 
    transition: { duration: 1.5, ease: "easeInOut" } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    rotate: -0.2, 
    transition: { duration: 1.5, ease: "easeInOut" } 
  },
};

const CONTAINER_VARIANTS = {
  show: { transition: { staggerChildren: 0.2 } },
};

/* -------------------- Hook Préload Optimisé -------------------- */
function usePreloadImages(urls) {
  useEffect(() => {
    const promises = urls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = reject;
      });
    });
    // On ne bloque pas le thread principal
    Promise.all(promises).catch(err => console.error("Preload error", err));
  }, [urls]);
}

/* -------------------- HeaderSection Optimisée -------------------- */
function HeaderSection() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  
  // Amélioration InView : une seule détection suffit souvent
  const isInView = useInView(sectionRef, { margin: "-100px", once: false });
  const { scrollYProgress } = useScroll({ 
    target: sectionRef,
    offset: ["start start", "end start"] 
  });
  
  const yTransform = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  // Préchargement
  usePreloadImages(IMAGES);

  // Slideshow logic
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center overflow-hidden bg-black px-6 sm:px-12 lg:px-32 py-20 lg:py-0"
    >
      {/* BACKGROUND SLIDESHOW OPTIMISÉ */}
      <motion.div
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ y: yTransform }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={IMAGES[currentImage]}
            alt=""
            variants={BG_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full object-cover will-change-[opacity,transform]"
            loading={currentImage === 0 ? "eager" : "lazy"}
            decoding="async"
            aria-hidden="true"
          />
        </AnimatePresence>
      </motion.div>

      {/* OVERLAY - Utilisation de CSS pur pour la performance */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-[1]" />

      {/* CONTENT */}
      <div className="relative z-10 w-full sm:max-w-4xl text-left">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="inline-block text-purple-400 font-bold tracking-[0.3em] uppercase text-xs sm:text-sm mb-3 mt-2"
        >
          FORMATIONS & SERVICES MULTIDISCIPLINAIRES
        </motion.span>

        <motion.div 
          variants={CONTAINER_VARIANTS} 
          initial="hidden" 
          animate={isInView ? "show" : "hidden"}
        >
          {["STEPIC, booster des talents :", "Formations, Informatique et création", "Multimédia"].map((line, index) => (
            <motion.h1
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.6 } }
              }}
              className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg"
            >
              {index === 2 ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                  {line}
                </span>
              ) : line}
            </motion.h1>
          ))}

          {/* SOUS-TITRE */}
          <motion.p
            variants={{
              hidden: { opacity: 0, x: -20 },
              show: { opacity: 1, x: 0, transition: { delay: 0.8 } }
            }}
            className="text-base sm:text-lg md:text-xl text-gray-200 mb-10 italic max-w-2xl border-l-4 border-purple-600 pl-4 py-2"
          >
            Formations · Informatique · Multimédia <br /> Communication · Presse · Évènementiel
          </motion.p>

          {/* BOUTONS */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { delay: 0.4 } }
            }}
            className="flex flex-col sm:flex-row items-start gap-5"
          >
            <button
              onClick={() => navigate("/commande")}
              className="group relative flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-xl hover:scale-105 transition-transform active:scale-95"
            >
              Commander
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <ScrollLink
              to="showreel"
              smooth={true}
              duration={1500}
              className="flex items-center justify-center px-8 py-3 rounded-full text-white border-2 border-white/40 font-bold backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer"
            >
              Voir démonstration
            </ScrollLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default React.memo(HeaderSection);