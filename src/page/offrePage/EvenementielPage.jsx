import React, { useState, useEffect } from 'react'
import OffreCard from '@/components/OffreCard'
import { getData } from '@/service/api'
import { H2 } from '@/components/Typographie'


const EvenementielPage = () => {

  const [offreEvent, setOffreEvent] = useState([])

  const fetchOffre = async () => {
    try {
      const response = await getData("services/by_categorie/7/")
      console.log(response.data)
      setOffreEvent(response.data)
    } catch(err) {
      console.log("Erreur lors de la récupération des offres de la production : ", err)
    }
  }

  useEffect(() => {
    fetchOffre()
  }, [])


  return (
    <div className="min-h-screen flex flex-col justify-start items-center  py-20 px-4">
      <H2>Evenementiel</H2>

      <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-8 mt-10">
        {offreEvent.map((section) => (
          <OffreCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  )
}

export default EvenementielPage