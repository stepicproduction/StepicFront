import React, { useState, useEffect } from 'react'
import OffreCard from '@/components/OffreCard'
import { getData } from '@/service/api'
import { H2 } from '@/components/Typographie'


const EvenementielPage = () => {

  const [offreEvent, setOffreEvent] = useState([])
  const [isLoading, setIsLoading] = useState(true);

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
    fetchOffre().finally(() => setIsLoading(false));
  }, [])

  if (isLoading) {
       return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                {/* Un petit spinner animé en CSS ou une simple phrase */}
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6c63ff]"></div>
                <p className="text-[#6c63ff] font-medium animate-pulse">Chargement...</p>
            </div>
        );
    }


  return (
    <div className="min-h-screen flex flex-col justify-start items-center  py-20 px-4">
      <H2>Évènementiel</H2>

      <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-8 mt-10">
        {offreEvent.map((section) => (
          <OffreCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  )
}

export default EvenementielPage