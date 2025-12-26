import React from 'react'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';

import HeaderSection from "@/section/HeaderSection";
import OffreSection from "@/section/OffreSection";
import ProjetSection from "@/section/ProjetSection";
import ActualiteSection from "@/section/ActualiteSection";
import TemoignageSection from "@/section/TemoignageSection";
import ShowreelSection from "@/section/ShowreelSection";
import AboutSection from "@/section/AboutSection";
import Learningcta from '@/section/Learningcta';

function HomePage() {

    const location = useLocation();

    // Logique pour gérer le défilement après la navigation
    useEffect(() => {
        if (location.state && location.state.scrollTo) {
            const target = location.state.scrollTo;
            
            // Un petit délai assure que la page est bien rendue avant de tenter de défiler
            setTimeout(() => {
                scroller.scrollTo(target, {
                    smooth: true,
                    duration: 500,
                    offset: -80, // Ajustez cet offset si votre Navbar n'est pas 80px de haut
                });
                
                // OPTIONNEL : Nettoyer l'état pour éviter un défilement accidentel au retour arrière
                // Si vous voulez le faire :
                // window.history.replaceState({}, document.title, window.location.pathname);
            }, 100); 
        }
    }, [location.state])

  return (
    <div className='relative'>
        <HeaderSection/>
        <AboutSection/>
        <OffreSection/>
        <div className='relative'>
            <ProjetSection/>
            <ShowreelSection/>
        </div>
        <ActualiteSection/>
        <Learningcta/>
        <TemoignageSection/>
    </div>
  )
}

export default HomePage