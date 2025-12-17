import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import personalData from "../../assets/personalData.png"

const Step1 = ({ register, errors, handleNext }) => {
  return (
  <div className='p-4 flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 md:gap-0'>

    {/* Partie Formulaire */}
    <div className='w-full md:w-[50%] flex flex-col items-center md:items-start'>
      <h3 className='text-center md:text-left font-semibold text-2xl md:text-3xl mb-6'>
        Etape 1 : Infos Personnelles
      </h3>

      <div className='flex flex-col mb-6 w-full'>
        <label htmlFor="nomClient">Nom :</label>
        <input
          type="text"
          id='nom'
          {...register("nomClient")}
          className={`rounded-full px-4 py-2 border focus:border-[#8a2be2] focus:ring-[#8a2be2] outline-none transition duration-200 
          ${errors.nomClient ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
        />
        {errors.nomClient && (
          <p className='text-sm text-red-500 mt-1'>{errors.nomClient.message}</p>
        )}
      </div>

      <div className='flex flex-col mb-6 w-full'>
        <label htmlFor="prenomClient">Prenom(s) :</label>
        <input
          type="text"
          id='prenom'
          {...register("prenomClient")}
          className={`rounded-full px-4 py-2 border focus:border-[#8a2be2] focus:ring-[#8a2be2] outline-none transition duration-200 
          ${errors.prenomClient ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
        />
        {errors.prenomClient && (
          <p className='text-sm text-red-500 mt-1'>{errors.prenomClient.message}</p>
        )}
      </div>

      <div className='flex justify-center w-full'>
        <button
          type='button'
          className="flex items-center justify-center gap-2 px-4 py-1 sm:px-6 sm:py-3 rounded-full text-white font-semibold 
            bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] hover:from-[#6c63ff] hover:to-[#8a2be2] 
            shadow-lg transition-colors duration-300 cursor-pointer w-15 h-15 sm:w-full sm:h-auto"
          onClick={() => handleNext()}
        >
          <span className="hidden sm:inline">Suivant</span> 
          <FaArrowRight />
        </button>
      </div>
    </div>

    {/* Partie Image — cachée sur mobile */}
    <div className='hidden md:flex w-full md:w-[50%] justify-center mt-6 md:mt-0'>
      <img
        src={personalData}
        alt="Données personnelles"
        className='w-[80%] md:w-full max-w-sm md:max-w-none'
      />
    </div>

  </div>
);

}

export default Step1
