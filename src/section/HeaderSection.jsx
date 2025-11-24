import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import { motion, useScroll, useTransform } from "framer-motion";

const btnBase =
  "px-4 py-2 text-sm sm:text-base md:text-lg font-medium rounded-full transition-all duration-300 min-w-[100px] sm:min-w-[140px] md:min-w-[160px]";
const btnPrimary = `${btnBase} bg-[#0B1D5D] text-white hover:bg-[#091645] shadow-lg hover:shadow-xl transform hover:scale-105`;
const btnOutline = `${btnBase} border-2 border-black text-black bg-white/70 hover:bg-[#0B1D5D] hover:text-white hover:border-[#0B1D5D] cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 h-14 md:h-12`;

function HeaderSection() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  // Framer Motion : scroll progress de la section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"], // 0 au début, 1 à la fin de la section
  });

  // Parallax : déplacement vertical du fond
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  const title =
    "STEPIC, l'art du multimédia et de l'audiovisuel à votre service";
  const subtitle =
    "Un accompagnement en communication et multimédia qui vous ressemble";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1, ease: "easeOut" } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 1 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[100vh] flex flex-col justify-center items-center text-center text-black px-4 sm:px-6 md:px-8 lg:px-10 overflow-hidden"
    >
      {/* 🌄 Image de fond animée */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(/src/assets/photo2.jpg)`,
          backgroundPosition : `center`,
          y: backgroundY,
        }}
      />

    {/* 🧊 Overlay pour lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent backdrop-blur-[2px]" />

      {/* 📝 Contenu (fixe pendant le scroll) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col  items-center justify-center w-full max-w-7xl mx-auto"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#6c63ff] mb-6 sm:mb-8 md:mb-10 text-center leading-tight drop-shadow-sm">
          {title}
        </h1>

        <p className="text-base md:text-lg max-w-2xl sm:max-w-3xl md:max-w-4xl leading-relaxed font-semibold text-[#0B1D5D] px-2 mb-8">
          "{subtitle}"
        </p>

        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full sm:w-auto"
        >
          <button
            onClick={() => navigate("/commande")}
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] hover:from-[#6c63ff] hover:to-[#8a2be2] shadow-lg transition-colors duration-300 cursor-pointer h-14 md:h-12 w-48 min-w-40"
          >
            Commander
          </button>

          <button className="px-6 py-2 h-14 md:h-12 font-[600] text-[#0B1D5D] border border-[#0B1D5D] rounded-full shadow-lg hover:bg-[#0B1D5D] hover:text-white transition-all duration-300 cursor-pointer">
            <Link to="showreel" smooth={true}>
              Voir démonstration
            </Link>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeaderSection;
