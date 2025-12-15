import React from 'react'
import { FaLongArrowAltRight } from "react-icons/fa"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

function Offre({ nom, description, image, button, categorieId}) {
  const navigate = useNavigate()
  const redirect = () => {
    const path = button === "S'inscrire" ? '/inscription' : '/commande'

    if(path == "/commande" || "/inscription") {
      navigate(path, {state : { preselectedCategoryId: categorieId }})
    } else {
      navigate(path)
    }
  }

 return (
    // CONTENEUR PRINCIPAL : Ombre plus visible (shadow-2xl) et fond blanc directement ici
    <div 
      // Changement : Utilisation de shadow-2xl pour une ombre plus visible et plus douce que le shadow-xl
      className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto rounded-2xl bg-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 cursor-pointer h-full"
    >
      
      {/* Contenu interne (p-6/p-8 sert de padding) */}
      <div className="h-full flex flex-col items-center justify-between p-6 sm:p-8 text-center">
        
        {/* --- IMAGE RONDE ET CENTRÉE --- */}
        <div className="mb-6 mt-2">
          <img
            src={image}
            alt={nom}
            className="w-40 h-40 sm:w-36 sm:h-36 object-cover rounded-full shadow-md mx-auto"
            loading='lazy'
          />
        </div>

        {/* --- TEXTE --- */}
        <div className="flex flex-col items-center mb-6 flex-grow">
          <h3 className="font-bold text-xl text-black mb-2">
            {nom}
          </h3>
          
          {/* Sous-titre optionnel (gris italique) */}
          <p className="text-sm text-gray-400 italic mb-3">
             {/* {sousTitre} */} 
          </p>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed h-32 overflow-hidden flex items-center">
            {description}
          </p>
        </div>

        {/* --- BOUTON --- */}
        <div className="mt-auto w-full flex justify-end">
          <Button
            variant="link"
            size="default"
            onClick={redirect}
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-full text-white font-semibold 
                       duration-300 cursor-pointer text-[#0B1D5D]
                       h-10 md:h-12 w-40 md:w-48"
          >
            {button} <FaLongArrowAltRight />
          </Button>
        </div>
      </div>
    </div>
)
}

export default Offre
