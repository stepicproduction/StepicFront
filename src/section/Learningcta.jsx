import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Learningcta = () => {
    const navigate = useNavigate()

   const handleNavigate = () => {
        navigate('/contact')
    }

  return (
    <section className="relative overflow-hidden bg-[#0B1D5D] py-20 px-6 sm:px-12 h-[80vh] flex items-center z-10 mb-20">
      {/* Petit effet de design en arrière-plan */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <motion.div 
            className="text-center md:text-left"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
          <h2 className="font-title text-3xl md:text-5xl text-white mb-4 leading-tight">
           Quelque chose vous échappe ?
          </h2>
          <p className="font-body text-blue-100 text-sm sm:text-base opacity-80">
            Nos experts sont là pour répondre à vos questions sur nos productions 
          audiovisuelles ou nos programmes de formation.
          </p>
        </motion.div>

        <motion.div 
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button onClick={handleNavigate} className="font-title bg-white w-[250px] text-blue-900 px-10 py-4 rounded-full text-lg hover:bg-[#8a2be2] hover:text-white transition-all duration-300 shadow-2xl cursor-pointer">
            Contactez-nous
          </button>
          <span className="font-body text-xs text-blue-200 opacity-60 italic">
          </span>
        </motion.div>
      </div>
    </section>
  )
}

export default Learningcta