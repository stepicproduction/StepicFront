import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getData } from '@/service/api';

const ActuEntrepriseDetaille = () => {
  const { id } = useParams();
  const [actu, setActu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActuById = async (id) => {
      try {
        const response = await getData(`actualites/${id}/`);
        setActu(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'actualité : ", err);
      }
    };


  useEffect(() => {
    fetchActuById(id).finally(() => setIsLoading(false));
  }, [id]);

  const formatDate = (dateString) => {
      if (!dateString) return "";
      
      // 1. Nettoyage : On récupère "YYYY-MM-DD" et "HH:mm" 
      // en ignorant le reste (secondes/microsecondes)
      const parts = dateString.split(' ');
      const datePart = parts[0]; // "2025-12-16"
      const timePart = parts[1] ? parts[1].substring(0, 5) : "00:00"; // "00:00"

      // 2. Création de l'objet Date
      const date = new Date(`${datePart}T${timePart}`);

      // 3. Formatage avec Heure et Minute
      return new Intl.DateTimeFormat('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      }).format(date).replace(':', 'h'); // Optionnel : remplace ":" par "h" pour un style plus français (ex: 10h30)
  };  


    if (isLoading) {
       return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                {/* Un petit spinner animé en CSS ou une simple phrase */}
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6c63ff]"></div>
                <p className="text-[#6c63ff] font-medium animate-pulse">Chargement de l'actualité...</p>
            </div>
        );
    }

    if (!actu) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-10 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-red-600 font-semibold text-lg">Actualité non trouvé.</p>
                    <button onClick={() => window.history.back()} className="mt-4 text-gray-600 underline">Retour</button>
                </div>
            </div>
        );
    }  

  return (
   <div className="min-h-screen w-full bg-white text-black py-10 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto pt-30">
            
        <div className="flex flex-col lg:flex-row gap-10">
            
            {/* --- Contenu principal de l'article --- */}
            <main className="lg:w-2/3 flex-1">
                
                {/* Titre */}
                <h2 className="text-2xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                    {actu.titreActu.toUpperCase()}
                </h2>
                
                {/* Méta Info (Source et Date) */}
                <div className="text-gray-500 text-sm mb-6 flex items-center space-x-4 border-b pb-4">
                    <div className="flex items-center">
                        {/* <Calendar className="w-4 h-4 mr-1 text-red-600" /> */}
                        {formatDate(actu.datePub)}
                    </div>
                </div>
                
                {/* Image principale */}
                <img
                    src={actu.imageActu}
                    alt={actu.titreActu}
                    className="w-full sm:w-[60%] h-auto object-cover rounded-lg mb-8 shadow-lg"
                />
                

                {/* Contenu complet de l'article */}
                <p className="whitespace-pre-line text-gray-700 text-sm sm:text-base leading-relaxed mb-4 flex-1">
                    {actu.contenuActu}
                </p>
                
            </main>
            
            
        </div>
    </div>    
    )
}

export default ActuEntrepriseDetaille