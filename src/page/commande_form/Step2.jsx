import React from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import coordonnees from "../../assets/coordonnees.webp"

const Step2 = ({ register, errors, handleNext, handlePrevious }) => {
  return (
    <div className='p-4 flex flex-col md:flex-row min-h-[80vh] md:min-h-auto items-center justify-center gap-6 md:gap-0'>
      {/* Formulaire */}
      <div className='w-full md:w-[50%] flex flex-col items-center justify-center'>
        <h3 className='text-center font-semibold text-2xl md:text-3xl mb-6'>
          Etape 2 : Coordonnées
        </h3>

        <div className='flex flex-col w-full max-w-sm mb-4'>
          <label htmlFor="emailClient" className='mb-2 text-center'>Email :</label>
          <input
            type='email'
            id='email'
            {...register("emailClient")}
            className={`rounded-full px-4 py-3 border focus:border-[#8a2be2] focus:ring-[#8a2be2] outline-none transition duration-200 
            ${errors.emailClient ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
          />
          {errors.emailClient && (
            <p className='text-sm text-red-500 mt-1 text-center'>{errors.emailClient.message}</p>
          )}
        </div>

        <div className='flex flex-col w-full max-w-sm mb-6'>
          <label htmlFor="phone" className='mb-2 text-center'>Téléphone :</label>
          <input
            type='tel'
            id='phone'
            {...register("telephone")}
            className={`rounded-full px-4 py-3 border focus:border-[#8a2be2] focus:ring-[#8a2be2] outline-none transition duration-200 
            ${errors.telephone ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
          />
          {errors.telephone && (
            <p className='text-sm text-red-500 mt-1 text-center'>{errors.telephone.message}</p>
          )}
        </div>

        <div className='flex sm:flex-row justify-center gap-4 w-full max-w-sm'>
          <button
            type='button'
            className="flex items-center justify-center gap-2 px-4 py-1 sm:px-6 sm:py-3 rounded-full text-white font-semibold 
              bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] hover:from-[#6c63ff] hover:to-[#8a2be2] 
              shadow-lg transition-colors duration-300 cursor-pointer w-15 h-15 sm:w-full sm:h-auto"
            onClick={handlePrevious}
          >
            <FaArrowLeft /> 
            <span className="hidden sm:inline">Précédent</span>
          </button>

          <button
            type='button'
            className="flex items-center justify-center gap-2 px-4 py-1 sm:px-6 sm:py-3 rounded-full text-white font-semibold 
              bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] hover:from-[#6c63ff] hover:to-[#8a2be2] 
              shadow-lg transition-colors duration-300 cursor-pointer w-15 h-15 sm:w-full sm:h-auto"
            onClick={handleNext}
          >
            <span className="hidden sm:inline">Suivant</span>
             <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Image — cachée sur mobile */}
      <div className='hidden md:flex w-full md:w-[50%] justify-center mt-6 md:mt-0'>
        <img
          src={coordonnees}
          alt="Coordonnées"
          className='w-[80%] md:w-full max-w-sm md:max-w-none'
        />
      </div>
    </div>
  )
}

export default Step2
