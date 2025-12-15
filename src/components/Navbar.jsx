import React, { useState } from "react";
import logo from "../assets/LOGO_STEPIC.webp";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { Link as ScrollLink, scroller } from "react-scroll"; // Renommage pour éviter le conflit
import { useNavigate, useLocation } from "react-router-dom"; // Ajout de useLocation
import { NavLink } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(1);
  const navigate = useNavigate();
  const location = useLocation(); // Pour connaître l'URL actuelle
  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { id:1, to: "", label: "Accueil" },
    { id:2, to: "about", label: "A propos" },
    { id:3, to: "offre", label: "Offres" },
    { id:5, to: "presse_actu", label: "Actualités" },
    { id:6, to: "contact", label: "Contact" },
  ];

  return (
    <header
      className="fixed top-0 left-0 w-full h-[80px] px-6 sm:px-12 lg:px-32 flex justify-between items-center bg-gradient-to-br from-white/10 via-white/70 to-transparent backdrop-blur-lg shadow-2xl z-50 transition-all duration-300"
    >
      {/* ... (votre code logo inchangé) ... */}
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="logo"
          className="w-[55px] h-[55px] md:w-[65px] md:h-[65px] object-contain cursor-pointer"
          onClick={() => navigate("")}
        />
      </div>

      {/* Menu desktop */}
      <nav className="hidden lg:flex flex-1 justify-center">
        <ul className="flex items-center gap-16 text-[16px] font-medium text-gray-800">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                `cursor-pointer relative group transition-all duration-300`
              }
            >
              {({ isActive }) => (
                <div
                  className={`
                    py-2 inline-block font-semibold 
                    group-hover:text-[#8a2be2] 
                    after:content-[""] after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 
                    after:h-0.5 after:bg-[#8a2be2] after:w-0 group-hover:after:w-full
                    after:transition-all after:duration-300 
                    ${isActive ? "text-[#8a2be2] after:w-full" : "text-gray-800 after:w-0"}
                  `}
                >
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </ul>
      </nav>

      {/* Bouton Se connecter (inchangé) */}
      {/* <div className="hidden lg:block">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center justify-center gap-2 px-6 py-2 rounded-full text-[#0B1D5D] border border-[#0B1D5D] hover:bg-[#0B1D5D] hover:text-white font-semibold shadow-lg transition-all duration-300 cursor-pointer h-14 md:h-12 w-48"
        >
          Se connecter <FaArrowRight />
        </button>
      </div> */}

      {/* Menu hamburger mobile (inchangé) */}
      <div
        className="lg:hidden cursor-pointer text-gray-800 z-50 bg-transparent"
        onClick={toggleMenu}
      >
        {isOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
      </div>

      {/* Menu mobile */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[70%] 
                    bg-white/80 backdrop-blur-md shadow-2xl
                    flex flex-col items-center pt-24 gap-10 
                    transform transition-transform duration-500 ease-in-out 
                    z-40 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <ul className="flex flex-col items-center gap-8 text-[20px] font-medium text-gray-800">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              // Suppression de onClick={toggleMenu} car il est maintenant dans handleScrollToSection
              className="hover:text-[#6c63ff] transition duration-200"
              // Utilisation du gestionnaire unifié
              onClick={toggleMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </ul>
      </div>
    </header>
  );
}

export default Navbar;