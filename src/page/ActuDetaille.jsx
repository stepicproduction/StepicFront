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
        return <div className="text-center py-20">Chargement de l'article...</div>;
    }

    if (!article) {
        return <div className="text-center py-20 text-red-600">Article non trouvé.</div>;
    }

    // Préparation des données pour l'affichage (similaire à l'image)
    const title = article.titre.toUpperCase() || article.titreActu.toUpperCase();
    const imageSrc = article.image || article.imageActu;
    const datePub = article.datePub || article.date_pub;
    const content = article.contenu || article.contenuActu;

    // Simulation des infos méta
    const source = `PAR STEPIC.INFO ACTUALITÉ`; 
    const categorie = "À la une, Actualité, Politique";

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
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                        {title}
                    </h1>
                    
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
                        className="w-[60%] h-auto object-cover rounded-lg mb-8 shadow-lg"
                    />
                    

                    {/* Contenu complet de l'article */}
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 flex-1">
                        {content}
                    </p>
                    
                </main>
                
                {/* --- Barre latérale (Sidebar) --- */}
                {/* <aside className="lg:w-1/3">
                    <SidebarActu allActu={allActu} currentActuId={article.id} />
                </aside> */}
                
            </div>
        </div>  
    )
}

export default ActuDetaille