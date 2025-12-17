import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { motion, useScroll, useTransform } from "framer-motion";
import photo2 from "@/assets/photo2.jpg";
import header1 from "@/assets/header1.webp";
import header2 from "@/assets/header2.webp";
import header3 from "@/assets/header3.webp";
import header4 from "@/assets/header4.webp";
import header5 from "@/assets/header5.webp";

function HeaderSection() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  // ---- PARALLAX BACKGROUND ----
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);

  const title =
    "STEPIC, l'art du multimédia et de l'audiovisuel à votre service";
  const subtitle =
    "Un accompagnement en communication et multimédia qui vous ressemble";

  // ---- ANIMATIONS ----
  const titleVariant = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const subtitleVariant = {
    hidden: { opacity: 0, y: 35 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.15 },
    },
  };

  const btnLeftVariant = {
    hidden: { opacity: 0, x: -40 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.25 },
    },
  };

  const btnRightVariant = {
    hidden: { opacity: 0, x: 40 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.35 },
    },
  };

  // ---- SLIDESHOW BACKGROUND ----
  const images = [
    photo2,
    header1,
    header2,
    header3,
    header4,
    header5,
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // change toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="
        relative min-h-screen
        flex flex-col justify-center items-center
        text-center text-black
        px-4 sm:px-6 md:px-8 lg:px-10
        overflow-hidden
      "
    >
      {/* BACKGROUND PARALLAX */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 w-full h-full bg-cover bg-center will-change-transform"
      >
        <div
          className="w-full h-full bg-top sm:bg-center"
          style={{
            backgroundImage: `url(${images[currentImage]})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            transition: "background-image 1s ease-in-out",
          }}
        ></div>
      </motion.div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-transparent"></div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl mx-auto">
        {/* TITLE */}
        <motion.h1
          variants={titleVariant}
          initial="hidden"
          animate="show"
          className="
            text-4xl sm:text-5xl md:text-6xl
            font-bold text-[#6c63ff]
            mb-6 sm:mb-8 md:mb-10
            leading-tight drop-shadow-sm
          "
        >
          {title}
        </motion.h1>

        {/* SUBTITLE */}
        <motion.p
          variants={subtitleVariant}
          initial="hidden"
          animate="show"
          className="
            text-lg sm:text-xl md:text-2xl
            max-w-3xl sm:max-w-4xl md:max-w-5xl
            leading-relaxed
            text-white
            px-3 md:px-4
            mb-10

          "
        >
          "{subtitle}"
        </motion.p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full sm:w-auto">
          {/* LEFT BUTTON */}
          <motion.button
            variants={btnLeftVariant}
            initial="hidden"
            animate="show"
            onClick={() => navigate("/commande")}
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-full  text-white font-semibold bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] hover:from-[#6c63ff] hover:to-[#8a2be2] shadow-lg transition-colors duration-300  h-10.5 w-53 md:h-12 md:w-48 cursor-pointer"
          >
            Commander
          </motion.button>

          {/* RIGHT BUTTON */}
          <motion.div
            variants={btnRightVariant}
            initial="hidden"
            animate="show"
          >
            <ScrollLink
              to="showreel"
              smooth={true}
              duration={600}
              offset={-60}
              className="
                flex items-center justify-center gap-2 px-6 py-2 rounded-full  text-white
                border border-white
                shadow-lg
                hover:bg-[#0B1D5D] hover:border-[#0B1D5D]
                transition-all duration-300
                cursor-pointer


              "
            >
              Voir démonstration
            </ScrollLink>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeaderSection;
