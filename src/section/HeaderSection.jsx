import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { motion, AnimatePresence, useInView, useTransform, useScroll } from "framer-motion";
import photo2 from "@/assets/photo2.webp";
import header1 from "@/assets/header1.webp";
import header2 from "@/assets/header2.webp";
import header3 from "@/assets/header3.webp";
import header4 from "@/assets/header4.webp";
import header5 from "@/assets/header5.webp";

/* -------------------- Hook Préload Images -------------------- */
function usePreloadImages(urls) {
  useEffect(() => {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, [urls]);
}

/* -------------------- HeaderSection V3 -------------------- */
function HeaderSection() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: sectionRef });
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, 25]); // parallaxe douce

  // --- Images + Préload ---
  const images = [photo2, header1, header2, header3, header4, header5];
  usePreloadImages(images);

  // --- Slideshow ---
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length, isInView]);

  const bgVariants = {
    initial: { opacity: 0, scale: 1.05, rotate: 0 },
    animate: { opacity: 1, scale: 1, rotate: 0.2, transition: { duration: 1.5, ease: "easeInOut" } },
    exit: { opacity: 0, scale: 0.95, rotate: -0.2, transition: { duration: 1.5, ease: "easeInOut" } },
  };

  // --- Animations Staggered ---
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.3 } },
  };
  const lineVariant = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.8 } } };
  const subtitleVariant = { hidden: { opacity: 0, x: 100 }, show: { opacity: 1, x: 0, transition: { ease: "easeOut", duration: 0.8, delay: 1 } } };
  const btnContainerVariant = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.6, delay: 0.1 } } };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center px-4 sm:px-8 lg:px-32 overflow-hidden"
    >
      {/* BACKGROUND SLIDESHOW + PARALLAX + ROTATE */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center will-change-transform"
        style={{ y: yTransform }}
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
          />
        </AnimatePresence>
      </motion.div>

      {/* OVERLAY DÉGRADÉ */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-1"></div>

      {/* CONTENT */}
      <div className="relative z-10 w-full sm:max-w-4xl text-left">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="inline-block text-purple-400 font-bold tracking-[0.3em] uppercase text-xs sm:text-sm mb-2 sm:mb-4"
        >
          FORMATIONS & SERVICES MULTIDISCIPLINAIRES
        </motion.span>

        {/* TITRE STAGGERED */}
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          {[
            "STEPIC, booster des talents :",
            "Informatique, Langues et création",
            "Multimédia"
          ].map((line, index) => (
            <motion.h1
              key={index}
              variants={lineVariant}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-2 sm:mb-4 leading-[1.1] sm:leading-[1.2] drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] break-words"
            >
              {index === 2 ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">{line}</span>
              ) : line}
            </motion.h1>
          ))}
        </motion.div>

        {/* SOUS-TITRE */}
        <motion.p
          variants={subtitleVariant}
          initial="hidden"
          animate="show"
          className="text-base sm:text-lg md:text-xl text-gray-200 mb-10 italic max-w-full md:max-w-2xl border-l-4 border-purple-600 pl-4 sm:py-2 break-words"
        >
          <span className="hidden md:inline text-3xl text-purple-400 font-serif">“</span>
          Langues · Informatique · Multimédia <br /> Communication · Presse · Évènementiel
          <span className="hidden md:inline text-3xl text-purple-400 font-serif">”</span>
        </motion.p>

        {/* BOUTONS AVEC GLOW */}
        <motion.div
          variants={btnContainerVariant}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 w-full sm:w-auto pb-2"
        >
          <button
            onClick={() => navigate("/commande")}
            className="group relative flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-full font-bold bg-gradient-to-r from-purple-600 to-indigo-500 shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-indigo-600 active:scale-95 cursor-pointer text-white h-12 sm:h-auto"
          >
            Commander
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <ScrollLink
            to="showreel"
            smooth={true}
            duration={2000}
            offset={-60}
            className="flex items-center justify-center px-6 sm:px-8 py-3 rounded-full text-white border-2 border-white/40 font-bold backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white active:scale-95 cursor-pointer h-12 sm:h-auto"
          >
            Voir démonstration
          </ScrollLink>
        </motion.div>
      </div>
    </section>
  );
}

export default HeaderSection;
