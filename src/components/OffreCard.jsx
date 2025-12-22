import React from 'react'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const OffreCard = ({ section }) => {

  const navigate = useNavigate()
  const redirect = () => {
    // 1. Utiliser section.button pour déterminer le chemin (Corrigé)
    const path = section.button === "S'inscrire" ? '/inscription' : '/commande' 

    // 2. Fixer la condition d'URL (L'ancienne était toujours vraie)
    if(path === "/commande" || path === "/inscription") {
      navigate(path, {
        state : { 
          // NOUVEAU: Passage des IDs nécessaires pour la présélection
          preselectedCategorieId: String(section.categorie), // Assurez-vous que l'ID est une string
          preselectedServiceIds: [String(section.id)], // Assurez-vous que c'est un tableau de strings
        }
      })
    } else {
      navigate(path)
    }
  }

return (
  // Conteneur principal : Fond blanc, coins arrondis, ombre subtile, pas de dégradé.
  <div 
    className="relative w-full sm:max-w-sm md:max-w-md rounded-lg overflow-hidden border border-gray-200 shadow-md transition-shadow duration-300 hover:shadow-xl mx-auto h-auto hover:border hover:border-[#8a2be2] group"
    // Rendre toute la carte cliquable (comme edX)
    onClick={redirect} 
  >
    <div className="bg-white rounded-lg text-center flex flex-col items-center h-full">

      <div className='relative w-full h-40 bg-white flex flex-col justify-center items-center p-4'>

        {/* Image du cours/contenu (ex: le nuage Google) */}
        <div className="bg-white flex items-center justify-center rounded-full w-30 h-30">
          <img
            src={section.image}
            alt={section.nom}
            // Retrait du rounded-full et ajustement de la taille pour le bandeau
            className="w-4/5 h-auto object-contain max-h-24 mt-2" 
          />
        </div>
      </div>
      
      {/* 2. Détails du Texte - Fond Blanc */}
      <div className='flex flex-col justify-between h-24 lg:h-20'>
        
        <div className='px-4 py-4 sm:px-6 sm:py-4'>
          {/* Titre du Cours (Noir/Gris foncé) */}
          <h3 className="text-base font-semibold text-gray-900 leading-snug mb-1">
            {section.nom}
          </h3>        
        </div>
        
      </div>
      <div className="mt-2 bg-[#8a2be2] w-full flex justify-end">
        <Button 
          onClick={redirect}
          variant="link"
          size="default"
          className="flex items-center justify-center gap-2 px-6 py-2 rounded-full font-semibold 
                      duration-300 cursor-pointer text-white
                      h-10 md:h-12 w-40 md:w-48"
        >
          {section.button}
          <ChevronRight /> 
        </Button> 
      </div>
     
    </div>
  </div>
)
}

export default OffreCard