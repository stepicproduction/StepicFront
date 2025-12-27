import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react'; 
import { is } from 'zod/v4/locales';

const ActuCard = ({id, image, imageActu, contenu, contenuActu, date_pub, datePub, titre, titreActu, value='entreprise'}) => {

    const finalTitle = titre || titreActu
    const finalImage = image || imageActu
    const finalContent = contenu || contenuActu
    const finalDate = date_pub || datePub
    
    const navigate = useNavigate()

    const isEntreprise = value === 'entreprise';

    const category = isEntreprise ? "Entreprise" : "Info-Presse";

    const buttonName = isEntreprise ? "Voir le detail" : "Lire l'article";

    const handleViewMore = () => {
      if(!isEntreprise) {
        navigate("/actu_detaille/" + id)
      } else {
        navigate("/actu_entreprise_detaille/" + id)
      }
    }

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

 return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      {/* Image avec effet de zoom au survol */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={finalImage} 
          alt={finalTitle} 
          loading='lazy'
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Badge de catégorie flottant */}
        <div className="absolute top-4 left-4 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {category}
        </div>
      </div>

      {/* Contenu de la carte */}
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-gray-400 text-xs mb-2 flex items-center gap-1"><Calendar size={15} /> {formatDate(finalDate)}</span>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
          {finalTitle}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-6">
          {finalContent}
        </p>
        
        {/* Lien "Lire la suite" qui s'anime au survol de la carte */}
        <div className="mt-auto flex items-center text-purple-600 font-bold text-sm cursor-pointer" onClick={handleViewMore}>
          { buttonName }
          <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
        </div>
      </div>
    </div>
  );
};

export default ActuCard