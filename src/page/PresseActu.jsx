import React, { useState, useEffect } from 'react';
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


const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) {
    return text;
  }
  // Tronque au dernier mot complet avant la limite
  const trimmedString = text.substring(0, maxLength);
  return trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + '...';
}

// --- 2. COMPOSANT CARTE (Image à gauche, Texte à droite) ---
const ArticleCard = ({ item, categoryLabel = "ACTUALITE", tabValue }) => {

  const navigate = useNavigate();

  const title = item.titre || item.titreActu;
  const description = item.contenu || item.contenuActu;
  const imageSrc = item.image || item.imageActu;
  const datePub = item.datePub || item.date_pub;

  const notEntreprise = tabValue !== "entreprise";

  const DESCRIPTION_MAX_LENGTH = 180;

  const authorInfo = `PAR STEPIC.INFO ACTUALITÉ`

  const handleViewMore = () => {
    if (notEntreprise) {
      navigate("/actu_detaille/" + item.id);
    } else {
      navigate("/actu_entreprise_detaille/" + item.id);
    }
    
  }

  const formatDate = (dateString) => {
      if (!dateString) return "";
      
      // 1. Nettoyage : On récupère "YYYY-MM-DD" et "HH:mm" 
      // en ignorant le reste (secondes/microsecondes)
      const parts = dateString.split(' ');
      const datePart = parts[0]; // "2025-12-16"
      const timePart = parts[1] ? parts[1].substring(0, 5) : "00:00"; // "00:00"

      // 2. Création de l'objet Date
      const date = new Date(`${datePart}T${timePart}`);

      // 3. Formatage avec Heure et Minute
      return new Intl.DateTimeFormat('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      }).format(date).replace(':', 'h'); // Optionnel : remplace ":" par "h" pour un style plus français (ex: 10h30)
  };  

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
        <button className="text-sm font-semibold text-gray-900 border border-gray-300 px-4 py-2 rounded hover:bg-sky-600 hover:text-gray-200 transition duration-300 self-start mt-auto cursor-pointer"
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

  const [actu, setActu] = useState([])
  const [presse, setPresse] = useState([])
  const isMobile = useIsMobile();

  const fetchActu = async () => {
    try {
      const response = await getData("actualites/")
      console.log(response.data)
      setActu(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération de l'actualité concernant l'entreprise : ", err)
    }
  }

  const fetchPresse = async () => {
    try {
      const response = await getData("presses/")
      console.log(response.data)
      setPresse(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération de la presse de l'entreprise : ", err)
    }
  }

  // Fonction appelée par ArticleCard
  useEffect(() => {
    Promise.all([
      fetchActu(),
      fetchPresse(),      
    ])
  }, [])

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-white text-black py-10 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto pt-15 relative">
      
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
          href="https://www.facebook.com/STEPICINFOS" 
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
          className="w-9 h-9 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-[#0A66C2] hover:text-white transition-all duration-300 hover:scale-110" 
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
        
        {/* Liste des onglets */}
        <TabsList className="w-full sm:w-auto flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 bg-transparent mb-12 mt-10 mx-auto">
          <TabsTrigger
            value="entreprise"
            className="text-base sm:text-lg font-semibold text-black px-6 py-3 rounded-xl transition-all
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 
              data-[state=active]:via-indigo-600 data-[state=active]:to-purple-600 
              data-[state=active]:text-white shadow-md"
          >
            ENTREPRISE
          </TabsTrigger>

          <TabsTrigger
            value="info"
            className="text-base sm:text-lg font-semibold text-black px-6 py-3 rounded-xl transition-all
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 
              data-[state=active]:via-indigo-600 data-[state=active]:to-purple-600 
              data-[state=active]:text-white shadow-md"
          >
            INFOS & PRESSE
          </TabsTrigger>
        </TabsList>

        {/* --- Contenu Entreprise --- */}
        <TabsContent value="entreprise" className="w-full flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
          {!isMobile && actu.map((item) => (
            <ArticleCard key={item.id} item={item} tabValue="entreprise" />
          ))}

          {isMobile && (
            <Carousel className="max-w-[400px] mx-auto">
              <CarouselContent>
                {actu.map(item => (
                <CarouselItem key={item.id} className="min-w-[85%]">
                  <ArticleCard key={item.id} item={item} tabValue="entreprise" />
                </CarouselItem>
              ))}
              </CarouselContent>
              <CarouselPrevious className="text-black cursor-pointer"/>
              <CarouselNext className="text-black cursor-pointer"/>
            </Carousel>
          )}
          
          {/* Message si vide (au cas où) */}
          {actu.length === 0 && (
            <p className="text-center text-gray-500">Aucune actualité entreprise.</p>
          )}
        </TabsContent>

        {/* --- Contenu Infos --- */}
        <TabsContent value="info" className="w-full flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
          {!isMobile && presse.map((item) => (
            <ArticleCard key={item.id} item={item} tabValue="info" />
          ))}

          {isMobile && (
            <Carousel className="max-w-[400px] mx-auto">
              <CarouselContent>
                {presse.map(item => (
                <CarouselItem key={item.id} className="min-w-[85%]">
                  <ArticleCard key={item.id} item={item} tabValue="info" />
                </CarouselItem>
              ))}
              </CarouselContent>
              <CarouselPrevious className="text-black cursor-pointer"/>
              <CarouselNext className="text-black cursor-pointer"/>
            </Carousel>
          )}

          {presse.length === 0 && (
            <p className="text-center text-gray-500">Aucune info presse.</p>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}

export default PresseActu;