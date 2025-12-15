import React from 'react'
import { FaLongArrowAltRight } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'

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
    className="relative w-full sm:max-w-sm md:max-w-md rounded-lg overflow-hidden border border-gray-200 shadow-md transition-shadow duration-300 hover:shadow-xl mx-auto pb-2 h-auto hover:border hover:border-[#8a2be2] group"
    // Rendre toute la carte cliquable (comme edX)
    onClick={redirect} 
  >
    <div className="bg-white rounded-lg text-center flex flex-col items-center h-full">

      <div className='relative w-full h-40 bg-white flex flex-col justify-center items-center p-4'>
        
        {/* Simulation d'un logo de marque (optionnel, comme sur les cartes edX) */}
        {/* <div className="absolute top-2 left-2 p-1">
          <img src={section.logoUrl || "placeholder-logo.png"} alt="Logo" className="h-6 w-auto object-contain" />
        </div> */}

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
      <div className='flex flex-col justify-between px-4 py-4 sm:px-6 sm:py-4 h-36'>
        
        <div>
          {/* Titre du Cours (Noir/Gris foncé) */}
          <h3 className="text-base font-semibold text-gray-900 leading-snug mb-1">
            {section.nom}
          </h3>
          
          {/* Description/Université (texte gris plus discret) */}
          {/* <p className="text-sm text-gray-500">{section.description || "Nom de l'Université"}</p> */}
        </div>

        {/* Badge / Tag (Simple, comme sur les cartes edX) */}
        {/* <div className="mt-3">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded font-medium border border-gray-300">
            {section.tag || "Course"}
          </span>
        </div> */}
        
        {/* Le bouton est retiré pour laisser la place au badge et rendre toute la carte cliquable. 
        Si vous devez absolument le garder, utilisez ceci : */}
        <button 
          onClick={redirect}
          className="
          flex items-center justify-center gap-2 
          px-6 py-2 rounded-full 
          text-white font-semibold 
          bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] hover:from-[#6c63ff] hover:to-[#8a2be2] 
          shadow-lg transition-colors duration-300 cursor-pointer w-[50%] mt-4 text-sm mx-auto"
        >
          {section.button}
          {/* {section.button} <FaLongArrowAltRight /> */}
        </button> 
      </div>
     
    </div>
  </div>
)
}

export default OffreCard