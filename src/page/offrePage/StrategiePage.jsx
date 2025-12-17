import React, { useState, useEffect } from "react";
import { H2 } from "@/components/Typographie";
import { FaLongArrowAltRight } from "react-icons/fa"
import OffreCard from "@/components/OffreCard";

import { getData } from "@/service/api";




function StrategiePage() {

  const [offreStrategie, setOffreStrategie] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOffre = async () => {
    try {
      const response = await getData("services/by_categorie/2/")
      console.log(response.data)
      setOffreStrategie(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération de l'offre du catégorie strategie : ", err)
    }
  }

  useEffect(() => {
    fetchOffre().finally(() => setIsLoading(false))
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
      <H2>Stratégie & Conseil</H2>

      <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-8 mt-10">
        {offreStrategie.map((section) => (
          <OffreCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

export default StrategiePage;
