import React, { useState, useEffect } from "react";
import Offre from "../components/Offre";
import { H2 } from "@/components/Typographie";
import { motion } from "framer-motion";
import { getData } from "@/service/api";
import { useNavigate } from "react-router-dom";

const cardVariants = {
  hiddenLeft: { opacity: 0, x: -100, scale: 0.95 }, // partie gauche
  hiddenRight: { opacity: 0, x: 100, scale: 0.95 }, // partie droite
  visible: (i) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const wordVariants = {
  hidden : {opacity : 0, y : -20, scale : 0},
  visible : {opacity : 1, y : 0, scale :1 , transition: { duration: 1, type : "spring", stiffness : 100, damping : 12 }},
}


function OffreSection() {
  const [offres, setOffres] = useState([]);
  const navigate = useNavigate();

  const fetchOffre = async () => {
    try {
      const response = await getData("/categories/");
      setOffres(response.data);
    } catch (err) {
      console.log("Erreur :", err);
    }
  };

  useEffect(() => {
    fetchOffre();
  }, []);

  return (
    <div
      id="offre"
      className="py-10 px-4 sm:px-8 md:py-20 md:px-32 max-w-7xl mx-auto"
    >
      <motion.div 
        variants={wordVariants}
        initial="hidden"
        whileInView="visible"
      >
        <H2 className="text-[40px] leading-1.3 text-center font-semibold mb-[30px]">
          Nos Offres
        </H2>
        <p className="text-sm sm:text-base text-black leading-relaxed sm:leading-loose">« Parce que votre projet mérite l'excellence, nous combinons expertise technique et vision innovante pour vous offrir des services qui font la différence. Que ce soit pour le web ou l'image, nos offres sont le moteur de votre croissance numérique. »</p>
      </motion.div>

      <div className="mt-20 grid grid-cols-1 min-[1050px]:grid-cols-12 gap-6 md:gap-8 place-items-center">
        {offres.map((offre, i) => {
          // Déterminer si c'est la colonne gauche ou droite
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={offre.id}
              custom={i}
              initial={isLeft ? "hiddenLeft" : "hiddenRight"}
              whileInView="visible"
              variants={cardVariants}
              viewport={{ once: true, amount: 0.2 }}
              className="col-span-12 min-[1050px]:col-span-6"
            >
              <Offre {...offre} categorieId={offre.id} />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-32 flex justify-end px-4">
        <motion.button
          className="flex items-center justify-center gap-2 px-6 py-2 rounded-full text-[#0B1D5D] border border-[#0B1D5D] hover:bg-[#0B1D5D] hover:text-white font-semibold shadow-lg transition-all duration-300 cursor-pointer h-14 md:h-12 w-55"
          onClick={() => navigate("/offre")}
          whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
        >
          Voir toutes les offres
        </motion.button>
      </div>
    </div>
  );
}

export default OffreSection;
