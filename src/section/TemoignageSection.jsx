import React, { useState, useEffect } from 'react';
import { H2 } from '@/components/Typographie';
import { useNavigate } from 'react-router-dom';
import { getData } from '@/service/api';
import { getRelativeTime } from '../service/getRelativeTime'


// --- 2. Composant StarRating ---
const StarRating = ({ note }) => {
  const MAX_STARS = 5;
  return (
    <div className="flex text-yellow-400">
      {Array.from({ length: MAX_STARS }, (_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < note ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};



// --- 3. Composant Temoignage ---
const Temoignage = ({ image, nom, prenom, designation, message, date, note, email }) => {

  const initial = email ? email[0].toUpperCase() : nom[0].toUpperCase()
  console.log(initial)


  return (
    <div className="relative bg-white rounded-2xl shadow-md border border-gray-200 w-full max-w-md mx-auto pt-10">
      
      {/* Bande bleue avec l’image et les infos */}
      <div className="bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] relative px-5 py-4 rounded-br-[50px] overflow-visible">
        {/* Image du profil */}
        <div className={` ${image ? "absolute -top-5 -left-5 z-20 flex items-center justify-center " : "absolute -top-5 -left-5 z-20 w-33 h-33 rounded-full border-4 border-white shadow-lg object-cover flex items-center justify-center bg-gradient-to-r from-[#8a2be2] to-[#6c63ff]"}`}>
          {image? <img
            src={image}
            alt={nom}
            className="w-33 h-33 rounded-full border-4 border-white shadow-lg object-cover"
          /> : <span className='text-white text-6xl'> {initial} </span>}
        </div>

        {/* Nom, prénom et désignation sur trois lignes */}
        <div className="ml-35 text-white">
          <p className="font-bold text-base leading-none">{nom}</p>
          <p className="font-[20px] text-sm">{prenom}</p>
          <p className="text-xs font-[15px] pt-2">{designation}</p>
        </div>
      </div>

      {/* Contenu du témoignage */}
      <div className="p-6 mt-8">
        <div className="mb-3">
          <StarRating note={note} />
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {message}
        </p>

        <div className="flex justify-end pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium">
            Publié  {getRelativeTime(date)}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- 4. Composant Principal TemoignageSection ---
function TemoignageSection() {

  const navigate = useNavigate()

  const [temoin, setTemoin] = useState([])

  const fetchTemoignage = async () => {
    try {
      const response = await getData("temoignages/valide/")
      console.log(response.data)
      setTemoin(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération de données du témoignages : ", err)
    }
  }

  useEffect(() => {
    fetchTemoignage()
  }, [])

  return (
    <div className="py-10 px-4 sm:px-8 md:py-20 md:px-32 max-w-7xl mx-auto overflow-hidden">
      <H2 className="text-xl sm:text-2xl md:text-3xl text-center mb-8">Témoignages</H2>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-center">
        {temoin.map((temoin) => (
          <Temoignage
            key={temoin.id}
            image={temoin.image}
            nom={temoin.nomClient}
            prenom={temoin.prenomClient}
            designation={temoin.role}
            message={temoin.messageClient}
            date={temoin.dateTem}
            note={temoin.note}
            email={temoin.emailClient}
          />
        ))}
      </div>
       <div className="mt-32 flex justify-end px-4">
        <button
          variant="default"
          size="default"
          className="px-6 py-2 rounded-full text-[#0B1D5D] border border-[#0B1D5D] hover:bg-[#0B1D5D] hover:text-white font-semibold shadow-lg transition-all duration-300 cursor-pointer
              text-sm md:text-base whitespace-nowrap h-14 md:h-12 mt-2 sm:mt-3"
          onClick={() => navigate('/temoin')}
          whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
        >
         Partagez votre histoire
        </button>        
      </div>
    </div>
  );
}

export default TemoignageSection;
