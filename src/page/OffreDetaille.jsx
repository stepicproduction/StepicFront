// OffreDetaille.jsx
import React, { useState } from "react";
import {
  Compass,
  Image,
  Globe,
  Video,
  Megaphone,
  Calendar,
  Book,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion } from "framer-motion";
import StrategiePage from "@/page/offrePage/StrategiePage";
import IdentitePage from "@/page/offrePage/IdentitePage";
import CommunicationPage from "@/page/offrePage/CommunicationPage";
import ProductionPage from "@/page/offrePage/ProductionPage";
import PublicitePage from "@/page/offrePage/PublicitePage";
import EvenementielPage from "@/page/offrePage/EvenementielPage";
import FormationPage from "@/page/offrePage/FormationPage";

const textAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

const OffreDetaille = () => {

  const [activeTab, setActiveTab] = useState("strategie");

  const menuItems = [
    {id : "strategie", name: "Stratégie & Conseil", icon: Compass, link: "" },
    {id : "identite", name: "Identité visuelle & Design", icon: Image, link: "offreIdentite" },
    {id : "communication", name: "Communication digitale", icon: Globe, link: "offreCommunication" },
    {id : "production", name: "Production audiovisuelle", icon: Video, link: "offreProduction" },
    {id : "publicite", name: "Publicité & Médias", icon: Megaphone, link: "offrePublicite" },
    {id : "evenementiel", name: "Événementiel", icon: Calendar, link: "offreEvenementiel" },
    {id : "formation", name: "Formation & Ateliers", icon: Book, link: "offreFormation" },
  ];

  const handleTabClick = (name) => {
    setActiveTab(name)
  }

  const renderMainTab = (item) => {
    const isActive = activeTab === item.id
    const baseClasses = "flex items-center text-sm font-semibold px-4 py-3 cursor-pointer transition duration-300 whitespace-nowrap";

    return (
      <button
        key={item.id}
        onClick={() => handleTabClick(item.id)}
        className={`${baseClasses} ${
          isActive
            ? "text-white bg-[#008080] rounded-t-lg lg:rounded-md" // Onglet actif : fond vert (edX), texte blanc
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg" // Onglet inactif : gris, hover
        }`}
      >
        {item.name}
      </button>
    )
  } 

  const renderContent = () => {
    switch (activeTab) {
      case "strategie":
        return <StrategiePage />;
      case "identite":
        return <IdentitePage />;
      case "communication":
        return <CommunicationPage />;
      case "production":
        return <ProductionPage />;
      case "publicite":
        return <PublicitePage />;
      case "evenementiel":
        return <EvenementielPage />;
      case "formation":
        return <FormationPage />;
      default:
        return null;
  }
};



  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
      <div
        className="min-h-[50vh] h-[95vh] w-full bg-center bg-cover rounded-2xl mb-8 px-2 text-center relative flex flex-col justify-center items-center"
        style={{
          backgroundImage: 'url(/src/assets/offre.webp)',
          backgroundRepeat: 'no-repeat',  
          backgroundSize: 'cover',
        }}
      >
          {/* OVERLAY NOIR */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/70 to-transparent rounded-2xl"></div>

        <motion.h2
          variants={textAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl
            font-bold text-white
            mb-6 sm:mb-8 md:mb-10
            leading-tight drop-shadow-sm"
        >
          Découvrez nos offres !
        </motion.h2>

        {/* TEXTE */}
        <motion.p 
          variants={textAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative text-center text-lg text-gray-50 mb-12 max-w-3xl mx-auto pt-7 z-10">
          Si vous aspirez à voir vos idées prendre vie, à collaborer avec des passionnés sur des projets qui ont du sens,
          et à écrire avec nous le prochain chapitre de notre succès, alors votre parcours et votre personnalité trouvent
          ici l'écoute et le terrain de jeu qu'ils méritent.
        </motion.p>
  </div>

      <header className="px-5 pt-8 pb-0 lg:px-10 lg:pt-12 sticky top-0 z-20 sm:px-10 flex justify-center ">
        {/* Barre de Navigation Principale (Niveau 1) */}
        <nav className="">

          {/* affichage en mobile */}
          <div className="lg:hidden relative">
            <select
              onChange={(e) => setActiveTab(e.target.value)}
              value={activeTab}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-sm focus:border-[#008080] focus:ring focus:ring-[#008080]/50 appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,...")' }} // Customiser l'icône de flèche si nécessaire
            >
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown size={20} className="text-gray-500" />
            </div>
          </div>

              {/* affichage en desktop */}
          <ul className="hidden lg:flex lg:overflow-x-auto lg:justify-start lg:space-x-2 space-x-0 -mb-px pb-2">
            {menuItems.map((item) => renderMainTab(item))}
          </ul>
        </nav>
      </header>      

      {/* Contenu principal */}
      <main className="
        flex-1 p-8 text-black px-4 sm:px-10">
        {renderContent()}
      </main>
    </div>
  );
};

export default OffreDetaille;