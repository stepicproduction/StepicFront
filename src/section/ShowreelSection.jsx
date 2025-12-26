import React, { useState, useEffect } from 'react';
import { getData } from '@/service/api';
import ReactPlayer from 'react-player'; // Import spécifique pour YouTube
import { H2 } from '@/components/Typographie';
import { motion, useTransform } from 'framer-motion';


// Animation pour le titre "Showreel"
const titleVariants = {
  hidden: { 
    opacity: 0, 
    letterSpacing: "-0.5em", // Les lettres sont resserrées au début
    filter: "blur(12px)"     // Effet de flou artistique
  },
  visible: { 
    opacity: 1, 
    letterSpacing: "0.1em",  // Elles s'écartent avec élégance
    filter: "blur(0px)",
    transition: { 
      duration: 1.2, 
      ease: "easeOut" 
    } 
  }
};

// Animation pour le paragraphe (L'expertise STEPIC...)
const subTextVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1, 
      delay: 0.5, // Apparaît juste après le titre
      ease: "easeOut" 
    } 
  }
};

function ShowreelSection() {
  const [url, setUrl] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUrl = async () => {
    try {
      const response = await getData("showreels/");
      setUrl(response.data);
    } catch (err) {
      console.log("Erreur lors de la récupération d'url : ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrl();
  }, []);

  const firstLink = url?.[0]?.link || null;

  return (
    <section 
      className='w-full bg-[#0f1115] pt-10 py-20 px-4 z-20 shadow-[0_-30px_60px_rgba(0,0,0,0.5)]' 
      id='showreel'
      >
      <motion.div 
        initial="hidden"
        whileInView="visible"
        className='max-w-6xl mx-auto'>
        
        {/* EN-TÊTE */}
        <div className='mb-12 text-center'>
          <motion.div
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
          >
            <H2 className="text-white mb-6">Showreel</H2>
          </motion.div>
          
          <motion.div
            variants={subTextVariants}
            initial="hidden"
            whileInView="visible" 
            className='max-w-3xl mx-auto'>
            <p className="text-sm sm:text-base leading-relaxed sm:leading-loose text-gray-300 italic font-serif">
              «Parce qu'une démonstration vaut mille mots, explorez notre showreel pour découvrir la qualité et la diversité de nos réalisations audiovisuelles et numériques. »
            </p>
          </motion.div>
        </div>

        {/* LECTEUR VIDÉO */}
        <div className="max-w-5xl mx-auto">
          <div className="relative group">

            {/* Glow - hors flux */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-20" />

            {/* CONTENEUR À HAUTEUR FIXE */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/5 flex items-center justify-center">

              {/* Loader */}
              {loading && (
                <p className="text-gray-400 animate-pulse">
                  Chargement du lecteur...
                </p>
              )}

              {/* Player */}
              {!loading && firstLink && (
                <ReactPlayer
                  src={firstLink.replace("youtube.com", "youtube-nocookie.com")}
                  controls
                  width="100%"
                  height="100%"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0
                  }}
                  config={{
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        rel: 0
                      }
                    }
                  }}
                />
              )}

              {/* Fallback */}
              {!loading && !firstLink && (
                <p className="text-gray-500">
                  Aucune vidéo disponible pour le moment.
                </p>
              )}

            </div>
          </div>
        </div>

      </motion.div>
    </section>
  );
}

export default ShowreelSection;