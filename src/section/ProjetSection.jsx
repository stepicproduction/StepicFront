import React, { useState, useEffect } from "react";
import { H2, P } from "@/components/Typographie";
import { getData } from "@/service/api";

// Import des images
import projet1 from "../assets/projet1.png";
import projet2 from "../assets/projet2.png";
import projet3 from "../assets/projet3.png";
import projet4 from "../assets/projet4.png";
import projet5 from "../assets/projet5.png";
import projet6 from "../assets/projet6.png";
import projet7 from "../assets/projet7.png";
import projet8 from "../assets/projet8.png";
import projet9 from "../assets/projet9.png";
import projet11 from "../assets/projet11.png";
import projet12 from "../assets/projet12.jpg";
import projet18 from "../assets/projet18.png";

const PRIMARY_PURPLE = '#6c63ff'
const DARK_PURPLE = '#8a2be2'

// Liste des projets
/*const projets = [
  { image: projet1, description: "Durant le tournage d'un film court-métrage de l'ONG SCORE" },
  { image: projet2, description: "Projet 2" },
  { image: projet3, description: "Projet 3" },
  { image: projet4, description: "Projet 4" },
  { image: projet5, description: "Tournage pendant l'activité distribution de cache transfert mené par l'ONG ACF à Atsimo-Andrefana" },
  { image: projet6, description: "Interview d'un Paysan Leader bénéficiaire du projet ACF" },
  { image: projet7, description: "Tournage et réalisation d'une émission sur le processus éléctoral organisé par la fondation politique Allemande FES" },
  { image: projet8, description: "Production d'un court-métrage lié aux activités du Tribunal Financier Toliara" },
  { image: projet9, description: "Tournage d'un film long-métrage sur la sensibilisation environnementale produit par l'ONG WHH" },
  { image: projet11, description: "Tournage et réalisation d'une émission sur le processus éléctoral organisé par la fondation politique Allemande FES" },
  { image: projet12, description: "Projet 12" },
  { image: projet18, description: "Tournage d'une émission télévisée de l'ONG Internationale WHH" },
];*/

function ProjetSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [projets, setProjets] = useState([])

  // Nouveaux states pour affichage description
  const [activeIndex, setActiveIndex] = useState(null); // desktop
  const [showDescription, setShowDescription] = useState(false); // mobile

  const fetchProject = async () => {
    let response
    try {
      response = await getData("projets/")
      console.log(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération des données concernant les projets : ", err)
    }

    if(response) {
      setProjets(response.data)
    } else {
      setProjets([])
    }
  }

  // Détection du responsive
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  //charger les données
  useEffect(() => {
    fetchProject()
  }, [])

  // Auto-slide pour le diaporama mobile
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % projets.length);
        setShowDescription(false); // cacher desc quand slide change
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isMobile, projets.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projets.length);
    setShowDescription(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projets.length) % projets.length);
    setShowDescription(false);
  };

  // Version desktop - carousel infini
const DesktopCarousel = () => (
  <div className="mt-25 relative w-full overflow-hidden">
    <div className="flex animate-marquee gap-6">
      {[...projets, ...projets].map((projet, index) => (
        <div
          key={index}
          className="group relative w-[300px] sm:w-[250px] md:w-[350px] h-[400px] 
                     flex-shrink-0 rounded-2xl shadow-xl overflow-hidden cursor-pointer"
          style={{
            backgroundImage: `url(${projet.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay sombre au hover */}
          <div className="absolute inset-0 bg-blue-900/30 group-hover:bg-blue-900/60 transition-all" />

          {/* Description au hover */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-blue-900/70 p-4 text-center 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          >
            <p className="text-white text-lg font-[20px]">{projet.description_projet}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);


  // Version mobile - diaporama
  const MobileSlider = () => (
    <div className="mt-25 relative w-[90%] max-w-sm mx-auto">
      {/* Slide actuelle */}
      <div
        className="relative w-full h-[345px] rounded-2xl shadow-xl overflow-hidden cursor-pointer"
        style={{
          backgroundImage: `url(${projets[currentSlide].image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={() => setShowDescription(!showDescription)}
      >
        <div className="absolute inset-0 bg-blue-900/40" />

        {/* Affichage conditionnel avec fade */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-blue-900/70 p-4 text-center 
            transition-opacity duration-500 ${
              showDescription ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <p className="text-white text-lg font-[10px]">
            {projets[currentSlide].description}
          </p>
        </div>
      </div>

      {/* Contrôles navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md rounded-full p-2 hover:bg-white/50 transition-all"
        aria-label="Projet précédent"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md rounded-full p-2 hover:bg-white/50 transition-all"
        aria-label="Projet suivant"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );

  return (
    <section id="projets" className="w-full py-30 text-white overflow-hidden">
      <H2 className="text-center text-lg sm:text-xl md:text-3xl mb-10">
        Nos projets
      </H2>

      {isMobile ? <MobileSlider /> : <DesktopCarousel />}

      {/* Animation marquee desktop */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

export default ProjetSection;
