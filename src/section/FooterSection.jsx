import React, { useState, useEffect } from "react"; 
import logo from "../assets/logo_stepic2.webp"; 
import { FaFacebookF, FaLinkedinIn, FaEnvelope, FaArrowUp } from "react-icons/fa"; 
import { FaYoutube } from "react-icons/fa6"; 
import { FaTiktok, FaWhatsapp } from "react-icons/fa6"; 
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { animateScroll as scroll } from 'react-scroll';
import { MapPin, Mail, Phone, House, Info, Bell, Briefcase } from "lucide-react";

export default function Footer({ active = "home" }) { 
  const [showTopBtn, setShowTopBtn] = useState(false); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const items = [ 
    { id: "", label: "Accueil", icon: <House size={18} /> }, 
    { id: "about", label: "À propos", icon: <Info size={18} /> }, 
    { id: "offre", label: "Offres", icon: <Briefcase size={18} /> }, 
    { id: "presse_actu", label: "Actualités", icon: <Bell size={18} /> }, 
    { id: "contact", label: "Contact", icon: <Mail size={18} /> }, 
  ]; 

  const services = [
    { id: "strategie", label: "Stratégie & Conseil" },
    { id: "identite", label: "Identité Visuelle & Design" },
    { id: "communication", label: "Communication digitale" },
    { id: "production", label: "Production audiovisuelle" },
    { id: "publicite", label: "Publicité & Médias" },
    { id: "evenementiel", label: "Évènementiel" },
    { id: "formation", label: "Formation & Ateliers" },
  ]

  const contacts = [
    {id: "email", label : "admin@stepic-mada.com <br/> stepic.mada@gmail.com", icon: <Mail size={18} />},
    {id: "phone", label : "+261 38 53 502 31", icon: <Phone size={18}/>},
    {id: "address", label : "ruelle n°2 (Derrière SUPERMAKI) <br/> Tanambao I, Toliara", icon: <MapPin size={18}/>}
  ]

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
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 min-[1110px]:grid-cols-4 gap-8"> 
        
        {/* Logo & description */} 
        <div className="w-[300px] min-[1110px]:-translate-x-8.5"> 
          <Link to="/" className="flex justify-center items-center mb-1 cursor-pointer">
            <img src={logo} alt="logo" loading="lazy" width="70" className="w-[70px] h-[70px]" /> 
          </Link>

          <p className="text-gray-400 mb-6 leading-relaxed text-center "> 
            <span className="text-center text-white italic">"Chaque pas nous rapproche du pic"</span>. <br /> Rejoignez-nous dans cette aventure créative.
          </p> 

          {/* Réseaux sociaux */} 
          <div className="flex justify-center space-x-3 mt-4"> 
            <a 
              href="https://www.facebook.com/RAOBISON.Steven601" 
              target="_blank" 
              rel="noreferrer"
              aria-label="Page Facebook STEPIC" 
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#1877F2] transition-colors duration-300" 
            > 
              <FaFacebookF className="text-white" /> 
            </a> 
            <a 
              href="https://www.linkedin.com/in/stepic-450aa8273/" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Profil Linkedin STEPIC"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#0072b1] transition-colors duration-300" 
            > 
              <FaLinkedinIn className="text-white" /> 
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
        <div className="min-[1110px]:translate-x-14"> 
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
            {services.map((service) => (
              <li key={service.id}>
                <Link 
                  to="/offre" 
                  state={{ activeService: service.id }} // On passe l'ID ici
                  className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer block"
                >
                  {service.label}
                </Link>
              </li>
            ))}
          </ul> 
        </div> 

        {/* Contact */} 
        <div> 
          <h4 className="text-lg font-semibold mb-6 text-white">Contact</h4> 
          <div className="space-y-4"> 
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center gap-3"> 
                {contact.icon}
                <span className="text-gray-400" dangerouslySetInnerHTML={{ __html: contact.label }}></span> 
              </div> 
            ))}
          </div> 
        </div> 
      </div> 
      {/* partie témoignage */}
      <p className="text-sm sm:text-base flex flex-col sm:flex-row gap-1.5 justify-center items-center">
        <span>Vous avez travaillé avec nous ?</span>  
        <Link to="/temoin" className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold gap-2 group transition-all"> Partagez votre expérience</Link>
      </p>   
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
      <div className="fixed bottom-10 left-5 z-50">
        <a
          href="https://wa.me/261385350231"
          target="_blank"
          rel="noreferrer"
          aria-label="Contacter STEPIC sur WhatsApp"
          className="group flex items-center bg-[#25D366] text-white rounded-full p-2 transition-all duration-300 ease-in-out hover:pr-5"
        >
          {/* Conteneur de l'icône */}
          <div className="flex items-center justify-center w-10 h-10 bg-[#25D366] rounded-full shrink-0">
            <FaWhatsapp size={24} />
          </div>

          {/* Texte avec effet Slide */}
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-500 ease-in-out group-hover:max-w-xs group-hover:ml-2">
            Contactez-nous sur WhatsApp
          </span>
        </a>
      </div>
    </footer> 
  ); 
}
