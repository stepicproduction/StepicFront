import React from 'react'
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

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
    /*useEffect(() => {
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
    }, [location.state])*/

  return (
    <div className='relative'>

      <Helmet>
        <title>STEPIC Madagascar - Accueil</title>
        <meta name="description" content="Découvrez STEPIC Madagascar : nos services, formations et projets." />
        <meta property="og:title" content="STEPIC Madagascar - Accueil" />
        <meta property="og:description" content="Découvrez STEPIC Madagascar : nos services, formations et projets." />
        <meta property="og:image" content="https://www.stepic-mada.com/logo.png" />
        <meta property="og:url" content="https://www.stepic-mada.com/" />
      </Helmet>   

        <HeaderSection/>
        <AboutSection/>
        <OffreSection/>
        <Learningcta/>
        <div className='relative'>
            <ProjetSection/>
            <ShowreelSection/>
        </div>
        <ActualiteSection/>
        <TemoignageSection/>
    </div>
  )
}

export default HomePage