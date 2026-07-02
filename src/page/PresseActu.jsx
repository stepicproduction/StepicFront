import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { getData } from '@/service/api';
import { useNavigate } from 'react-router-dom';
import { FaYoutube, FaTiktok } from "react-icons/fa6";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa"; 
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formatDate } from '@/service/formatDate';
import { cn } from "@/lib/utils"; // Assurez-vous d'avoir cet utilitaire shadcn

/* ---------------- HOOK MOBILE ---------------- */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const trimmedString = text.substring(0, maxLength);
  return trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + '...';
}

/* ---------------- COMPOSANT INDICATEURS ---------------- */
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

const ArticleCard = ({ item, categoryLabel = "ACTUALITE", tabValue }) => {
  const navigate = useNavigate();
  const title = item.titre || item.titreActu;
  const description = item.contenu || item.contenuActu;
  const imageSrc = item.image || item.imageActu;
  const datePub = item.datePub || item.date_pub;
  const notEntreprise = tabValue !== "entreprise";
  const DESCRIPTION_MAX_LENGTH = 180;
  const authorInfo = item.source || `STEPIC INFOS`

  const handleViewMore = () => {
    if (notEntreprise) navigate("/actu_detaille/" + item.id);
    else navigate("/actu_entreprise_detaille/" + item.id);
  } 

  return(

    <div className="w-full items-center bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow duration-300 mb-6 max-w-4xl"
      onClick={handleViewMore}
    >
      {/* Image : Prend 100% sur mobile, et une taille fixe (ex: 300px) sur Desktop */}
      <div className="w-full md:w-80 h-64 md:h-64 flex-shrink-0 relative">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-br-lg">
          {categoryLabel}
        </div>
      </div>


      {/* Contenu Texte */}
      <div className="p-4 md:p-6 flex flex-col justify-between items-start flex-1 h-64 md:h-auto">
        
        {/* Titre */}
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-snug">
          {title}
        </h3>

        {/* Info Auteur & Date */}
        <div className="text-xs text-gray-500 font-medium mb-3">
            {authorInfo} | {formatDate(datePub)}
        </div>

        {/* Description tronquée */}
        <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 flex-1">
          {truncateText(description, DESCRIPTION_MAX_LENGTH)}
        </p>

        {/* Bouton Voir Plus */}
        <button className="text-sm font-semibold text-gray-900 border border-gray-300 px-4 py-2 rounded hover:bg-[#6c63ff] hover:text-gray-200 transition duration-300 self-start mt-auto cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // Empêche l'événement de cliquer sur la carte de se déclencher
            handleViewMore();
          }}
        >
          VOIR PLUS
        </button>
      </div>
    </div>
  )
};

// --- 3. TON COMPOSANT PRINCIPAL ---
const PresseActu = () => {
  const [actu, setActu] = useState([]);
  const [presse, setPresse] = useState([]);
  const isMobile = useIsMobile();

  // États pour les indicateurs (1 par carrousel)
  const [apiActu, setApiActu] = useState(null);
  const [apiPresse, setApiPresse] = useState(null);
  const [currentActu, setCurrentActu] = useState(0);
  const [currentPresse, setCurrentPresse] = useState(0);

  // Sync pour le carrousel Actualités
  useEffect(() => {
    if (!apiActu) return;
    apiActu.on("select", () => setCurrentActu(apiActu.selectedScrollSnap()));
  }, [apiActu]);

  // Sync pour le carrousel Presse
  useEffect(() => {
    if (!apiPresse) return;
    apiPresse.on("select", () => setCurrentPresse(apiPresse.selectedScrollSnap()));
  }, [apiPresse]);

  const fetchActu = async () => {
    try {
      const response = await getData("actualites/");
      setActu(response.data);
    } catch (err) { console.log(err); }
  }

  const fetchPresse = async () => {
    try {
      const response = await getData("presses/");
      setPresse(response.data);
    } catch (err) { console.log(err); }
  }

  useEffect(() => {
    fetchActu();
    fetchPresse();
  }, []);

  const orderedActu = [...actu].reverse()
  const orderedPresse = [...presse].reverse();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-white text-black py-10 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto pt-15 relative">

      <Helmet>
        <title>STEPIC Madagascar-Tuléar - Presse & Actualités</title>
        <meta name="description" content="Découvrez les dernières actualités et presse de STEPIC Madagascar-Tuléar." />
        <meta property="og:title" content="STEPIC Madagascar-Tuléar - Presse & Actualités" />
        <meta property="og:description" content="Découvrez les dernières actualités et presse de STEPIC Madagascar-Tuléar." />
        <meta property="og:image" content="https://www.stepic-mada.com/logo.png" />
        <meta property="og:url" content="https://www.stepic-mada.com/presse-actu" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="STEPIC Madagascar-Tuléar - Presse & Actualités" />
        <meta name="twitter:description" content="Découvrez les dernières actualités et presse de STEPIC Madagascar-Tuléar." />
        <meta name="twitter:image" content="https://www.stepic-mada.com/logo.png" />
      </Helmet>
      
      
      <div className="fixed right-2 bottom-41 lg:bottom-auto lg:right-4 lg:top-[35%] lg:-translate-y-1/2 z-[100] flex items-center gap-2 lg:gap-4">
      
      {/* Texte vertical - Visible uniquement sur Large Screen (lg) */}
      <div className="hidden lg:flex items-center gap-3 [writing-mode:vertical-lr] rotate-180">
        <span className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase">
          Suivez-nous sur les réseaux
        </span>
        <div className="h-10 w-[1px] bg-gradient-to-t from-[#6c63ff] to-transparent"></div>
      </div>

      {/* Conteneur d'icônes style "Glassmorphism" */}
      <div className="flex flex-col gap-2 lg:gap-3 p-1.5 lg:p-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full shadow-2xl">
        
        {/* Facebook */}
        <a 
          href="https://www.facebook.com/profile.php?id=100064051059009" 
          target="_blank" 
          rel="noreferrer" 
          className="w-9 h-9 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-[#1877F2] hover:text-white transition-all duration-300 hover:scale-110" 
        > 
          <FaFacebookF size={14} className="lg:text-base" /> 
        </a>

        {/* LinkedIn */}
        <a 
          href="https://www.linkedin.com/in/stepic-infos-aa86b6356/" 
          target="_blank" 
          rel="noreferrer" 
          className="w-9 h-9 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-[#0072b1] hover:text-white transition-all duration-300 hover:scale-110" 
        > 
          <FaLinkedinIn size={14} className="lg:text-base" /> 
        </a>

        {/* Instagram */}
        <a 
          href="https://www.instagram.com/stepic.mada/" 
          target="_blank" 
          rel="noreferrer"
          className="w-9 h-9 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white transition-all duration-300 hover:scale-110" 
        > 
          <FaInstagram size={14} className="lg:text-base" /> 
        </a>

        {/* YouTube */}
        <a 
          href="https://youtube.com/@STEPICINFOS" 
          target="_blank" 
          rel="noreferrer" 
          className="w-9 h-9 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-[#FF0000] hover:text-white transition-all duration-300 hover:scale-110" 
        > 
          <FaYoutube size={14} className="lg:text-base" /> 
        </a>

        {/* TikTok */}
        <a 
          href="https://www.tiktok.com/@stepic_infos" 
          target="_blank" 
          rel="noreferrer" 
          className="w-9 h-9 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-black hover:text-white transition-all duration-300 hover:scale-110" 
        > 
          <FaTiktok size={14} className="lg:text-base" /> 
        </a>
        
      </div>
    </div>
      <Tabs defaultValue="entreprise" className="w-full">
        <TabsList className="w-full sm:w-auto flex flex-wrap justify-center gap-3 sm:gap-4 bg-transparent mb-12 mt-10 mx-auto">
          <TabsTrigger value="entreprise" className="text-base sm:text-lg font-semibold data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white px-6 py-3 rounded-xl transition-all shadow-md">
            ENTREPRISE
          </TabsTrigger>
          <TabsTrigger value="info" className="text-base sm:text-lg font-semibold data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white px-6 py-3 rounded-xl transition-all shadow-md">
            INFOS & PRESSE
          </TabsTrigger>
        </TabsList>

        {/* --- Onglet Entreprise --- */}
        <TabsContent value="entreprise" className="w-full flex flex-col gap-6">
          {!isMobile ? (
            orderedActu.map((item) => <ArticleCard key={item.id} item={item} tabValue="entreprise" />)
          ) : (
            <>
              <Carousel setApi={setApiActu} className="w-full max-w-[400px] mx-auto">
                <CarouselContent>
                  {orderedActu.map(item => (
                    <CarouselItem key={item.id} className="pl-4">
                      <ArticleCard item={item} tabValue="entreprise" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden" /> {/* On cache les flèches sur mobile pour laisser place aux points */}
                <CarouselNext className="hidden" />
              </Carousel>
              <CarouselDots api={apiActu} count={actu.length} current={currentActu} />
            </>
          )}
          {actu.length === 0 && <p className="text-center text-gray-500">Aucune actualité entreprise.</p>}
        </TabsContent>

        {/* --- Onglet Infos --- */}
        <TabsContent value="info" className="w-full flex flex-col gap-6">
          {!isMobile ? (
            orderedPresse.map((item) => <ArticleCard key={item.id} item={item} tabValue="info" />)
          ) : (
            <>
              <Carousel setApi={setApiPresse} className="w-full max-w-[400px] mx-auto">
                <CarouselContent>
                  {orderedPresse.map(item => (
                    <CarouselItem key={item.id} className="pl-4">
                      <ArticleCard item={item} tabValue="info" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden" />
                <CarouselNext className="hidden" />
              </Carousel>
              <CarouselDots api={apiPresse} count={presse.length} current={currentPresse} />
            </>
          )}
          {presse.length === 0 && <p className="text-center text-gray-500">Aucune infos presse.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PresseActu;