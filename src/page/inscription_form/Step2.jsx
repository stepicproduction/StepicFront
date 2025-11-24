import React from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import coordoonees from "../../assets/coordonnees.png"

const Step2 = ({ register, errors, handleNext, handlePrevious }) => {
 return (
  <div className="p-4 flex flex-col md:flex-row items-center gap-6">

    {/* Contenu principal */}
    <div className="w-full md:w-[50%] flex flex-col items-center md:items-start text-left">
      <h3 className="text-center md:text-left font-semibold text-3xl mb-6">
        Etape 2 : Coordonnées
      </h3>

      <div className="flex flex-col mb-6 w-full">
        <label htmlFor="emailClient" className="mb-1">Email :</label>
        <input 
          type="email" 
          id="email" 
          {...register("emailClient")} 
          className={`rounded-full focus:border-[#8a2be2] focus:ring-[#8a2be2] w-full ${errors.emailClient ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
        />
        {errors.emailClient && <p className="text-sm text-red-500 mt-1">{errors.emailClient.message}</p>}
      </div>

      <div className="flex flex-col mb-6 w-full">
        <label htmlFor="telephoneClient" className="mb-1">Téléphone :</label>
        <input 
          type="tel" 
          id="phone" 
          {...register("telephoneClient")} 
          className={`rounded-full focus:border-[#8a2be2] focus:ring-[#8a2be2] w-full ${errors.telephoneClient ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
        />
        {errors.telephoneClient && <p className="text-sm text-red-500 mt-1">{errors.telephoneClient.message}</p>}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
        <button 
          type="button" 
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold 
                     bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] hover:from-[#6c63ff] hover:to-[#8a2be2] 
                     shadow-lg transition-colors duration-300 cursor-pointer h-14 md:h-12 w-full sm:w-48"
          onClick={handlePrevious}
        >
          <FaArrowLeft /> Précédent
        </button>
        <button 
          type="button" 
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold 
                     bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] hover:from-[#6c63ff] hover:to-[#8a2be2] 
                     shadow-lg transition-colors duration-300 cursor-pointer h-14 md:h-12 w-full sm:w-48"
          onClick={handleNext}
        >
          Suivant <FaArrowRight />
        </button>
      </div>
    </div>

    {/* Image visible seulement sur desktop et tablette */}
    <div className="hidden md:flex w-full md:w-[50%] justify-center">
      <img src={coordoonees} alt="Coordonnées" className="max-w-full h-auto" />
    </div>

  </div>
 );
}

export default Step2