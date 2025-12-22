import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getData } from '@/service/api';

const ActuDetaille = () => {

    const { id } = useParams();
    
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchArticleById = async (id) => {
        try {
            const response = await getData(`presses/${id}/`);
            setArticle(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'article :", error);
        }
    }

    useEffect(() => {
        fetchArticleById(id).finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
       return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                {/* Un petit spinner animé en CSS ou une simple phrase */}
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6c63ff]"></div>
                <p className="text-[#6c63ff] font-medium animate-pulse">Chargement de l'actualité...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-10 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-red-600 font-semibold text-lg">Article non trouvé.</p>
                    <button onClick={() => window.history.back()} className="mt-4 text-gray-600 underline">Retour</button>
                </div>
            </div>
        );
    }

    // Préparation des données pour l'affichage (similaire à l'image)
    const title = article.titre.toUpperCase() || article.titreActu.toUpperCase();
    const imageSrc = article.image || article.imageActu;
    const datePub = article.datePub || article.date_pub;
    const content = article.contenu || article.contenuActu;

    // Simulation des infos méta
    const source = `PAR STEPIC.INFO ACTUALITÉ`; 
    const categorie = "Actualité";

  return (
    <div className="min-h-screen w-full bg-white text-black py-10 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto pt-30">
            
            <div className="flex flex-col lg:flex-row gap-10">
                
                {/* --- Contenu principal de l'article --- */}
                <main className="lg:w-2/3 flex-1">
                    
                    {/* Catégorie */}
                    <div className="text-red-600 font-semibold mb-2 uppercase text-sm">
                        {categorie.split(',')[0].trim()}
                    </div>
                    
                    {/* Titre */}
                    <h2 className="text-2xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                        {title}
                    </h2>
                    
                    {/* Méta Info (Source et Date) */}
                    <div className="text-gray-500 text-sm mb-6 flex items-center space-x-4 border-b pb-4">
                        <span className='font-medium'>{source}</span>
                        <span>|</span>
                        <div className="flex items-center">
                            {/* <Calendar className="w-4 h-4 mr-1 text-red-600" /> */}
                            {datePub}
                        </div>
                    </div>
                    
                    {/* Image principale */}
                    <img
                        src={imageSrc}
                        alt={title}
                        className="w-full sm:w-[60%] h-auto object-cover rounded-lg mb-8 shadow-lg"
                    />
                    

                    {/* Contenu complet de l'article */}
                    <p className="whitespace-pre-line text-gray-700 text-sm sm:text-base leading-relaxed mb-4 flex-1">
                        {content}
                    </p>
                    
                </main>
                
                
            </div>
        </div>  
    )
}

export default ActuDetaille