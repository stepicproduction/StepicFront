import React, { useState, useEffect } from "react"; 
import logo from "../assets/logo_stepic2.webp"; 
import { FaFacebookF, FaLinkedinIn, FaEnvelope, FaArrowUp } from "react-icons/fa"; 
import { FiHome, FiInfo, FiBriefcase, FiImage, FiBell, FiMail } from "react-icons/fi"; 
import { IoLocation } from "react-icons/io5"; 
import { FaPhone } from "react-icons/fa6"; 
import { FaYoutube } from "react-icons/fa6"; 
import { FaTiktok } from "react-icons/fa6"; 
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { animateScroll as scroll } from 'react-scroll';

export default function Footer({ active = "home" }) { 
  const [showTopBtn, setShowTopBtn] = useState(false); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const items = [ 
    { id: "", label: "Accueil", icon: <FiHome size={18} /> }, 
    { id: "about", label: "À propos", icon: <FiInfo size={18} /> }, 
    { id: "offre", label: "Offres", icon: <FiBriefcase size={18} /> }, 
    { id: "presse_actu", label: "Actualités", icon: <FiBell size={18} /> }, 
    { id: "contact", label: "Contact", icon: <FiMail size={18} /> }, 
  ]; 

  useEffect(() => { 
    const handleScroll = () => setShowTopBtn(window.pageYOffset > 300); 
    window.addEventListener("scroll", handleScroll); 
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    }; 
  }, []); 

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 2000,    // 1.5 seconde (ajuste à ta guise)
      delay: 0,
      smooth: 'easeInOutQuart' // Ajoute une accélération/décélération fluide
    });
  };

  return ( 
    <footer className="bg-blue-950 text-gray-300 relative"> 
      {/* Section principale */} 
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8"> 
        
        {/* Logo & description */} 
        <div> 
          <Link to="/" className="flex items-center mb-1 cursor-pointer">
            <img src={logo} alt="logo" loading="lazy" width="70" className="w-[70px] h-[70px]" /> 
          </Link>

          <p className="text-gray-400 mb-6 leading-relaxed"> 
            Chaque pas nous rapproche du pic. Rejoignez-nous dans cette aventure créative.
          </p> 

          {/* Réseaux sociaux */} 
          <div className="flex space-x-3 mt-4"> 
            <a 
              href="https://www.facebook.com/RAOBISON.Steven601" 
              target="_blank" 
              rel="noreferrer"
              aria-label="Page Facebook STEPIC" 
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300" 
            > 
              <FaFacebookF className="text-white" /> 
            </a> 
            <a 
              href="https://www.linkedin.com/in/stepic-450aa8273/" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Profil Linkedin STEPIC"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300" 
            > 
              <FaLinkedinIn className="text-white" /> 
            </a> 
            <a 
              href="mailto:admin@stepic-mada.com" 
              aria-label="Envoyer un email à STEPIC"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300" 
            > 
              <FaEnvelope className="text-white" /> 
            </a> 
            <a 
              href="https://youtube.com/%40stepic_production4859" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Chaîne YouTube STEPIC Production"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300" 
            > 
              <FaYoutube className="text-white" /> 
            </a> 
            <a 
              href="https://www.tiktok.com/@stepic_production" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Compte TikTok STEPIC"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-black transition-colors duration-300" 
            > 
              <FaTiktok className="text-white" /> 
            </a> 
          </div> 
        </div> 

        {/* Navigation */} 
        <div> 
          <h4 className="text-lg font-semibold mb-6 text-white">Navigation</h4> 
          <ul className="space-y-3"> 
            {items.map((item) => ( 
              <NavLink 
                key={item.id}
                to={item.id} 
                className={`flex items-center text-gray-400 hover:text-white transition-colors duration-200 gap-2 cursor-pointer ${ 
                  active === item.id ? "text-blue-400" : "" 
                }`} 
              > 
                {item.icon} 
                <span>{item.label}</span> 
              </NavLink> 
            ))} 
          </ul> 
        </div> 

        {/* Services */} 
        <div> 
          <h4 className="text-lg font-semibold mb-6 text-white">Services</h4> 
          <ul className="space-y-3"> 
            <li>Publicité & Médias</li> 
            <li>Production audiovisuelle</li> 
            <li>Graphique Designer</li> 
            <li>Formations & Ateliers</li> 
            <li>Communication digitale</li> 
          </ul> 
        </div> 

        {/* Contact */} 
        <div> 
          <h4 className="text-lg font-semibold mb-6 text-white">Contact</h4> 
          <div className="space-y-4"> 
            <div className="flex items-center"> 
              <FaEnvelope className="text-white mr-4 text-xl" /> 
              <span className="text-gray-400">stepic.mada@gmail.com</span> 
            </div> 
            <div className="flex items-center"> 
              <FaPhone className="text-white mr-4 text-xl" /> 
              <span className="text-gray-400">+261 34 28 899 56</span> 
            </div> 
            <div className="flex items-start"> 
              <IoLocation className="text-white mr-4 mt-1 text-2xl" /> 
              <span className="text-gray-400"> 
                ruelle n°2 Derrière SUPERMAKI<br />Tanambao I, Toliara 
              </span> 
            </div> 
          </div> 
        </div> 
      </div> 

      {/* Copyright */} 
      <div className="border-t border-gray-800 text-center py-4 text-gray-400 text-sm"> 
        © {new Date().getFullYear()} STEPIC. Tous droits réservés. 
      </div> 

      {/* Bouton retour en haut */} 
      {showTopBtn && ( 
        <button 
          onClick={scrollToTop} 
          className="fixed bottom-20 right-5 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-500 z-50" 
        > 
          <FaArrowUp className="text-white" /> 
        </button> 
      )} 
    </footer> 
  ); 
}
