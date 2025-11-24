import React from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const EquipeCard = ({equipe}) => {
  return (
   <Card className="w-[90%] sm:w-[300px] md:w-[350px] p-[3px] bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] rounded-xl overflow-hidden">
   
    <div className="bg-white w-full h-full rounded-[inherit] py-[20px] px-[15px]">
        
        {/* Image */}
        <div className="rounded-full m-auto border-8 border-gray-100 w-[150px] h-[150px] overflow-hidden">
            <img src={equipe.image} loading='lazy' alt="" className="rounded-full w-full h-full object-cover"/>
        </div>

        <CardHeader className="text-center mt-4">
            {/* Texte remis en noir car le fond est blanc */}
            <CardTitle className="text-black text-xl font-bold">
                {equipe.nom} {equipe.prenom}
            </CardTitle>
            {/* Texte description en gris */}
            <CardDescription className="text-gray-600 font-medium">
                {equipe.role}
            </CardDescription>
        </CardHeader>

    </div>
</Card>
  )
}

export default EquipeCard