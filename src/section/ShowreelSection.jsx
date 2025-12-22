import React, { useState, useEffect } from 'react';
import { getData } from '@/service/api';
import ReactPlayer from 'react-player'; // Import spécifique pour YouTube
import { H2 } from '@/components/Typographie';
import { motion, useTransform } from 'framer-motion';

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
        className='max-w-6xl mx-auto'>
        
        {/* EN-TÊTE */}
        <div className='mb-12 text-center'>
          <H2 className="text-white mb-6">Showreel</H2>
          
          <div className='max-w-3xl mx-auto relative'>
            <p className="text-base md:text-lg leading-relaxed text-gray-300 italic font-serif">
              « L'expertise STEPIC en images. Parce qu'une démonstration vaut mille mots, explorez notre showreel pour découvrir la qualité et la diversité de nos réalisations audiovisuelles et numériques. »
            </p>
          </div>
        </div>

        {/* LECTEUR VIDÉO */}
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="aspect-video bg-gray-800 animate-pulse rounded-2xl flex items-center justify-center">
               <p className='text-gray-400'>Chargement du lecteur...</p>
            </div>
          ) : firstLink ? (
            <div className="relative group">
              {/* Effet de Halo (Glow) en arrière-plan */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              
              {/* Conteneur du Player */}
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black">
                <ReactPlayer
                  src={firstLink.replace("youtube.com", "youtube-nocookie.com")}
                  controls={true}
                  width='100%'
                  height='100%'
                  config={{
                    youtube: {
                      playerVars: { 
                        modestbranding: 1,
                        rel: 0 
                      }
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <p className='text-center text-gray-500'>Aucune vidéo disponible pour le moment.</p>
          )}
        </div>
      </motion.div>
    </section>
  );
}

export default ShowreelSection;