import React, { useEffect, useState } from 'react';
import { H2 } from '@/components/Typographie';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import ActuCard from '@/components/ActuCard';
import { getData } from '@/service/api';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils"



function useIsMobile(breakpoint = 1080) {
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

const CarouselDots = ({ api, count, current }) => {
  if (!api || count <= 1) return null;
  
  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => api.scrollTo(i)}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            current === i ? "bg-sky-600 w-6" : "bg-gray-300 w-2"
          )}
        />
      ))}
    </div>
  );
};

function ActualiteSection() {
  const navigate = useNavigate(); 
  const [isVisible, setIsVisible] = useState(false);
  const [actu, setActu] = useState([])
  const [presse, setPresse] = useState([])
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);

 // États pour les indicateurs (1 par carrousel)
  const [apiActu, setApiActu] = useState(null);
  const [currentActu, setCurrentActu] = useState(0);

  useEffect(() => {
      if (!apiActu) return;
      apiActu.on("select", () => setCurrentActu(apiActu.selectedScrollSnap()));
    }, [apiActu]);
  

  const fetchData = async () => {
    setLoading(true);
    try {
      // On lance les deux appels en parallèle pour plus de rapidité
      const [resPresse, resActu] = await Promise.all([
        getData("presses"),
        getData("actualites")
      ]);

      if (Array.isArray(resPresse.data)) {
        setPresse([...resPresse.data].reverse().slice(0, 1));
      }
      if (Array.isArray(resActu.data)) {
        setActu([...resActu.data].reverse().slice(0, 1));
      }
    } catch (err) {
      console.log("Erreur lors de la récupération");
    } finally {
      setLoading(false); // 2. Fin du chargement
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    const section = document.getElementById('actualite');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, [loading]); // 3. Re-déclencher l'observer quand le chargement finit

  // Ne pas faire de return vide si on est en train de charger
  if (loading) return <div id="actualite" className="h-20"></div>;

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

  const combinedNews = [
  ...presse.map(p => ({
    ...p,
    type: "presse"
  })),
  ...actu.map(a => ({
    ...a,
    type: "actu"
  }))
]
  const combinedLength = actu.length + presse.length;
  //console.log(combinedLength)

  // Si aucune actu ni presse

  if(actu.length === 0 && presse.length === 0) {
    return(
      <div 
        className="py-10 px-4 sm:px-8 md:py-20 md:px-32 max-w-7xl mx-auto overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <H2 className="text-center mb-6">Actualités</H2>
        <p className="text-center text-gray-600">Aucune actualité disponible pour le moment. Revenez plus tard !</p>
      </div>
    ) 
  }


  return (
    <motion.div
      id="actualite"
      className="py-10 px-5 md:px-36 max-w-7xl mx-auto overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {/* Section titre + bouton */}
      <div className="relative flex flex-col items-center justify-center text-center mb-20">
                  {/* Texte */}
          <motion.div variants={textVariants} className="w-full mt-10 xl:mt-0">
            <H2 className="text-center mb-6">{/* Animate if needed */}Actualités</H2>
              <div className="bg-white w-full h-full rounded-2xl flex flex-col justify-center">
                <div className="text-black">
                  <p className="text-sm sm:text-base text-gray-800 leading-loose text-justify">
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
          </motion.div>
        
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 sm:px-6 md:px-12 mb-20 lg:mb-32">
        <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-20">

          {/* DESKTOP */}
          {!isMobile && (
              <motion.div variants={imageVariants} className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                {presse.map(p => (
                  <ActuCard key={p.id} id={p.id} image={p.image} date_pub={p.date_pub} contenu={p.contenu} titre={p.titre} value='infos' />
                ))}
                {actu.map(p => (
                  <ActuCard key={p.id} id={p.id} image={p.imageActu} date_pub={p.datePub} contenu={p.contenuActu} titre={p.titreActu} value='entreprise' />
                ))}
              </motion.div>
          )}

          {/* MOBILE */}
          {isMobile && (
            <>
            
              <Carousel setApi={setApiActu} className="w-full max-w-[400px] mx-auto">
                <CarouselContent>
                {combinedNews.map(item => (
                    <CarouselItem key={`${item.type}-${item.id}`}>
                      {item.type === "presse" ? (
                        <ActuCard
                          id={item.id}
                          image={item.image}
                          date_pub={item.date_pub}
                          contenu={item.contenu}
                          titre={item.titre}
                          value="info"
                        />
                      ) : (
                        <ActuCard
                          id={item.id}
                          image={item.imageActu}
                          date_pub={item.datePub}
                          contenu={item.contenuActu}
                          titre={item.titreActu}
                          value="entreprise"
                        />
                      )}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="text-black cursor-pointer"/>
                <CarouselNext className="text-black cursor-pointer"/>
              </Carousel>
              <CarouselDots api={apiActu} count={combinedLength} current={currentActu} />
            </>
            
          )}

        

        </div>
        <div className="w-full mt-6 flex justify-center">
          <button
            onClick={() => navigate("/presse_actu")}
            className="px-6 py-2 rounded-full text-[#0B1D5D] border border-[#0B1D5D] hover:bg-[#0B1D5D] hover:text-white shadow-lg transition-all duration-300 cursor-pointer text-sm md:text-base whitespace-nowrap h-14 md:h-12 mt-2 sm:mt-3"
          >
            Voir toutes les actualités
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ActualiteSection;
