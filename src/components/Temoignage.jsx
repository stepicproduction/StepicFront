import React from 'react'
import { Star } from 'lucide-react'

function Temoignage({ image, nom, message, note, date }) {
  return (
    <div className="bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] w-full max-w-xs sm:max-w-sm md:max-w-md p-6 sm:p-8 rounded-2xl flex flex-col gap-4 mx-auto shadow-md">
      
      
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden flex-shrink-0">
          <img src={image} alt={nom} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col items-center sm:items-start">
          <h3 className="font-bold text-lg sm:text-xl text-black">{nom}</h3>
          <div className="flex gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={i < note ? "fill-yellow-400 text-yellow-400" : "stroke-gray-300"}
              />
            ))}
          </div>
        </div>
      </div>

      
      <div className="flex flex-col gap-2 text-center sm:text-left text-sm sm:text-base">
        <p className="italic text-white">{message}</p>
        <span className="text-black text-xs sm:text-sm">Il y a {date}</span>
      </div>
    </div>
  )
}

export default Temoignage
