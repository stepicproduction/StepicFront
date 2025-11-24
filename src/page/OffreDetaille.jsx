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
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const OffreDetaille = () => {

  const [activeTab, setActiveTab] = useState("Stratégie & Conseil");

  const menuItems = [
    { name: "Stratégie & Conseil", icon: Compass, link: "" },
    { name: "Identité visuelle & Design", icon: Image, link: "offreIdentite" },
    { name: "Communication digitale", icon: Globe, link: "offreCommunication" },
    { name: "Production audiovisuelle", icon: Video, link: "offreProduction" },
    { name: "Publicité & Médias", icon: Megaphone, link: "offrePublicite" },
    { name: "Événementiel", icon: Calendar, link: "offreEvenementiel" },
    { name: "Formation & Ateliers", icon: Book, link: "offreFormation" },
  ];

  const handleTabClick = (name) => {
    setActiveTab(name)
  }

  const handleSelectChange = (event) => {
    const selectedLink = event.target.value;
    const selectedTab = mainTabs.find(tab => tab.link === selectedLink);
    
    if (selectedTab) {
      setActiveTab(selectedTab.name); // Mettre à jour l'état
      navigate(selectedLink);          // Naviguer vers la nouvelle URL
    }
  };

  const renderMainTab = (tabName, url) => {
    const isActive = activeTab === tabName
    const baseClasses = "flex items-center text-sm font-semibold px-4 py-3 cursor-pointer transition duration-300 whitespace-nowrap";

    return (
      <Link
        key={tabName}
        onClick={() => handleTabClick(tabName)}
        to={url}
        className={`${baseClasses} ${
          isActive
            ? "text-white bg-[#008080] rounded-t-lg lg:rounded-md" // Onglet actif : fond vert (edX), texte blanc
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg" // Onglet inactif : gris, hover
        }`}
      >
        {tabName}
      </Link>
    )
  } 


  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100 mt-[100px] px-4 sm:px-10">

      <header className="px-5 pt-8 pb-0 lg:px-10 lg:pt-12 sticky top-0 z-20 shadow-sm">
        {/* Barre de Navigation Principale (Niveau 1) */}
        <nav className="">

          {/* affichage en mobile */}
          <div className="lg:hidden relative">
            <select
              onChange={handleSelectChange}
              // Trouver la 'link' correspondant à l'activeTab pour la valeur de <select>
              value={menuItems.find(tab => tab.name === activeTab)?.link || ""} 
              className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-sm focus:border-[#008080] focus:ring focus:ring-[#008080]/50 appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,...")' }} // Customiser l'icône de flèche si nécessaire
            >
              {menuItems.map((item) => (
                <option key={item.name} value={item.link}>
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
            {menuItems.map((item) => renderMainTab(item.name, item.link))}
          </ul>
        </nav>
      </header>      

      {/* Contenu principal */}
      <main className="
        flex-1 p-8 text-black">
        {/* L'Outlet sera maintenant correctement affiché sous la barre de navigation */}
        <Outlet />
      </main>
    </div>
  );
};

export default OffreDetaille;