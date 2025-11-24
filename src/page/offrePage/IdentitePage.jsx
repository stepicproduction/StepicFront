import React, { useState, useEffect } from "react";
import { H2 } from "@/components/Typographie";
import OffreCard from "@/components/OffreCard";
import { getData } from "@/service/api";


function IdentitePage() {

  const [offreIdentite, setOffreIdentite] = useState([])

  const fetchOffre = async () => {
    try  {
      const response = await getData("services/by_categorie/8/")
      console.log(response.data)
      setOffreIdentite(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération des offres de l'identité : ", err)
    }
  }

  useEffect(() => {
    fetchOffre()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-start items-center py-20 px-4">
      <H2>Identité visuelle & Design</H2>

      <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-8 mt-10">
        {offreIdentite.map((section) => (
          <OffreCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

export default IdentitePage;
