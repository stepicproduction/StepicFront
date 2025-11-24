import React from "react"
import Offre from "../components/Offre"
import { H2, P } from '@/components/Typographie'
import { motion } from "framer-motion" // <-- import Framer Motion
import { useState, useEffect } from "react"
import { getData } from "@/service/api"
import { useNavigate } from "react-router-dom"

const PRIMARY_PURPLE = '#6c63ff'
const DARK_PURPLE = '#8a2be2'

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
}

function OffreSection() {

  const [offres, setOffres] = useState([])
  const navigate = useNavigate()

  const fetchOffre = async () => {
    try {
      const response = await getData("/categories/")
      console.log(response.data);
      setOffres(response.data);
    } catch (err) {
      console.log("Erreur :", err);
    }
  }

  useEffect(() => {
    fetchOffre()
  }, [])

  return (
    <div
      id="offre"
      className="py-10 px-4 sm:px-8 md:py-20 md:px-32 max-w-7xl mx-auto"
    >
      <H2 className="text-[40px] leading-1.3 text-center font-semibold mb-[30px]">
        Nos Offres
      </H2>

      <div
        className="mt-20 grid grid-cols-1 min-[1050px]:grid-cols-12 gap-6 md:gap-8 place-items-center"
      >
        {offres.map((offre, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="col-span-12 min-[1050px]:col-span-6"
          >
            <Offre {...offre} categorieId={offre.id} />
          </motion.div>
        ))}
      </div>
      <div className="mt-32 flex justify-end px-4">
        <button
          variant="default"
          size="default"
          className="flex items-center justify-center gap-2 px-6 py-2 rounded-full text-[#0B1D5D] border border-[#0B1D5D] hover:bg-[#0B1D5D] hover:text-white font-semibold shadow-lg transition-all duration-300 cursor-pointer h-14 md:h-12 w-55"
          onClick={() => navigate('/offre')}
          whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
        >
         Voir toutes les offres
        </button>        
      </div>

    </div>
  )
}

export default OffreSection
