import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { H2 } from "@/components/Typographie";
import { getData } from "@/service/api";
import { getRelativeTime } from "../service/getRelativeTime";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";


const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1, 
      delay: 0.5, // Apparaît juste après le titre
      ease: "easeOut" 
    } 
  }
};
/* ---------------- HOOK MOBILE ---------------- */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < breakpoint
  );

  useEffect(() => {
    const onResize = () =>
      setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}

/* ---------------- STAR ---------------- */
const StarRating = ({ note }) => (
  <div className="flex gap-1 text-yellow-400">
    {[...Array(5)].map((_, i) => (
      <span key={i}>{i < note ? "★" : "☆"}</span>
    ))}
  </div>
);

/* ---------------- CARD ---------------- */
const Card = ({ t }) => {
  const initial = t.emailClient?.[0]?.toUpperCase() || t.nomClient[0];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl p-5 shadow-xl"
    >
      <div className="flex flex-col h-auto sm:h-[300px] rounded-2xl">
        {/* Photo + nom/prénom/désignation */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg flex-shrink-0 border-2 border-white">
            {t.image ? (
              <img src={t.image} alt={t.nomClient} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] flex items-center justify-center text-white text-4xl font-bold">
                {initial}
              </div>
            )}
          </div>
          <div className="flex flex-col text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-900">{t.nomClient} {t.prenomClient}</h3>
            <p className="text-sm text-gray-600">{t.role}</p>
          </div>
        </div>

        {/* Message + Note */}
        <div className="flex flex-col justify-between h-full">
          <p className="text-sm leading-relaxed mb-4 text-black pt-7">{t.messageClient}</p>

          <div className="flex justify-between items-end mt-auto">
            <div className="bg-white rounded-full shadow-xl inline-flex px-3 py-2 mb-2">
              <StarRating note={t.note} />
            </div>
            <p className="text-xs text-gray-500 text-right">Publié {getRelativeTime(t.dateTem)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------- SECTION ---------------- */
export default function TemoignageSection() {
  const navigate = useNavigate();

  /* TOUS LES HOOKS ICI */
  const [temoins, setTemoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  const fetchTem = async () => {
    try {
      const response = await getData("temoignages/valide/")
      const data = Array.isArray(response.data) ? response.data : [];
      setTemoins(data);
      setLoading(false);
    } catch (err) {
      console.log(first)
      setTemoins([]);
      setLoading(false);
    }
  }

  /* FETCH */
  useEffect(() => {
    fetchTem()
  }, []);


  /* CONDITIONS D’AFFICHAGE */
 if (loading || !Array.isArray(temoins) || temoins.length < 3) return null;
 
  const lastSix = temoins.slice(0, 6);
  const hasMore = temoins.length > 6;

  return (
    <motion.section
      variants={textVariants}
      initial="hidden"
      whileInView="visible"
      className="py-24 bg-gray-50"
      style={{ clipPath: "ellipse(150% 100% at 50% 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div 
          className="mb-8"
        >
          <H2 className="text-xl sm:text-2xl md:text-3xl text-center mb-12">Ils nous font confiance</H2>
          <div className='max-w-7xl mx-auto relative px-5 md:px-36'>
            <p className='text-sm sm:text-base leading-loose text-black text-justify'>« Au-delà des chiffres, ce sont les retours de nos partenaires qui nous poussent à l'excellence. Découvrez les expériences de ceux qui ont choisi STEPIC pour transformer leurs ambitions en réalité. »</p>
          </div>
        </div>

        {/* DESKTOP */}
        {!isMobile && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {lastSix.map(t => (
              <Card key={t.id} t={t} />
            ))}
          </div>
        )}

        {/* MOBILE */}
        {isMobile && (
          <Carousel className="max-w-[400px] mx-auto">
            <CarouselContent>
              {temoins.map(t => (
              <CarouselItem key={t.id} className="min-w-[85%]">
                <Card t={t} />
              </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious className="text-black cursor-pointer"/>
            <CarouselNext className="text-black cursor-pointer"/>
          </Carousel>
        )}

          <div className="flex justify-end mt-16">
            <button
              onClick={() => navigate("/temoin")}
              className="px-6 py-2 rounded-full text-[#0B1D5D] border border-[#0B1D5D] hover:bg-[#0B1D5D] hover:text-white shadow-lg transition-all duration-300 cursor-pointer text-sm md:text-base whitespace-nowrap h-14 md:h-12 mt-2 sm:mt-3"
            >
              Partager votre histoire
            </button>
          </div>
      </div>
    </motion.section>
  );
}
