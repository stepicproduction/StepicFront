import React, { useState, useEffect } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import choix from "../../assets/choix.png"
import { getData } from '@/service/api' // Assurez-vous que le chemin est correct

const Step3 = ({ register, watch, errors, handlePrevious, handleNext, setValue }) => {

    // 1. Récupération de l'état de navigation
    const location = useLocation();

    // Les IDs que nous avons passés depuis OffreCard
    const { preselectedCategorieId, preselectedServiceIds } = location.state || {};

    // 1. Initialiser les états de manière claire
    const [categories, setCategories] = useState([]) // Renommé 'cat' en 'categories' pour la clarté
    const [offres, setOffres] = useState([])
    const [isLoading, setIsLoading] = useState(true); // État pour gérer le chargement
    //const [initialCategorySet, setInitialCategorySet] = useState(false);

    // Récupérer la valeur de la catégorie sélectionnée (probablement un ID de catégorie)
    const categorieWatch = watch("categorie")

    // --- Fonctions d'appel API ---

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await getData("/categories/with_commande/")
            // console.log("Catégories:", response.data) // Nettoyer les logs une fois en production
            setCategories(response.data)
        } catch (err) {
            console.error("Erreur lors de la récupération des catégories:", err);
            // Gérer l'erreur utilisateur ici si nécessaire
        } finally {
            setIsLoading(false);
        }
    }

    const fetchOffreByCat = async (id) => {
        if (!id) return; // Ne pas appeler si l'ID est vide
        try {
            const response = await getData(`/services/by_categorie/${id}/`)
            // console.log(`Offres pour la catégorie ${id}:`, response.data) // Nettoyer les logs
            setOffres(response.data)
        } catch (err) {
            console.error("Erreur lors de la récupération des offres:", err);
            setOffres([]); // S'assurer que les offres sont vides en cas d'erreur
        }
    }

    // 1. Charger les catégories au montage
    useEffect(() => {
        fetchCategories()
    }, [])

    // 2. [NOUVEAU] Logique de présélection de la Catégorie au chargement
    useEffect(() => {
        // Exécuté si une catégorie est passée via la navigation ET que les options sont chargées
        if (preselectedCategorieId && categories.length > 0) {
            const targetId = preselectedCategorieId;
            const isCategoryAvailable = categories.some(cat => String(cat.id) === targetId);

            // Si la catégorie est valide et n'est pas la valeur par défaut ("")
            if (isCategoryAvailable && categorieWatch !== targetId) { 
                // Force la sélection dans le formulaire
                setValue("categorie", targetId, { shouldValidate: true, shouldDirty: true });
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // IMPORTANT: La modification de `categorieWatch` ici déclenchera l'autre useEffect
                // qui charge les offres (`fetchOffreByCat`).
            }
        }
        
        // La logique originale de synchronisation RHF n'est plus nécessaire si l'ID est correctement passé
        // dans les defaultValues de RHF ou dans cet useEffect de présélection. 
        // Je laisse la logique originale si elle est nécessaire pour la synchronisation RHF/Async data:
        // if (categories.length > 0 && categorieWatch) { ... }
        
    }, [preselectedCategorieId, categories, setValue])

    // 2. Charger les offres lorsque la catégorie sélectionnée change
    useEffect(() => {
        // Le `watch` renvoie une string (l'ID). On s'assure qu'il est valide
        if (categorieWatch) {

            setValue("service", [], { shouldValidate: false, shouldDirty: true });

            fetchOffreByCat(categorieWatch)
        } else {
             // Vider les offres si aucune catégorie n'est sélectionnée
            setOffres([]);
        }
    }, [categorieWatch, setValue])

    // 4. [NOUVEAU] Gérer la présélection des Services/Checkboxes
    // Cette logique s'exécute après que les offres pour la catégorie présélectionnée sont chargées.
   useEffect(() => {
        // Cette logique ne doit s'exécuter que si nous avons des IDs de services de la navigation
        // ET que les offres pour la catégorie actuelle sont chargées.
        // On vérifie que la catégorie actuelle correspond à la catégorie présélectionnée
        
        if (preselectedServiceIds && preselectedServiceIds.length > 0 && offres.length > 0) {
            
            // On vérifie si la catégorie actuellement sélectionnée (categorieWatch) 
            // correspond à la catégorie initialement passée (preselectedCategorieId)
            const isTargetCategory = String(categorieWatch) === String(preselectedCategorieId);

            if (isTargetCategory) {
                const validPreselectedServiceIds = preselectedServiceIds
                    .filter(id => offres.some(offre => String(offre.id) === String(id)));

                if (validPreselectedServiceIds.length > 0) {
                    // C'est le seul endroit où on appelle setValue pour les services.
                    setValue("service", validPreselectedServiceIds, { shouldValidate: true, shouldDirty: true });
                }
            }
        }
    // Dépendance critique: s'exécute quand les offres sont mises à jour (après la sélection de catégorie).
    // Note: preselectedCategorieId est là pour la vérification `isTargetCategory` si nécessaire.
    }, [preselectedServiceIds, offres, setValue, categorieWatch, preselectedCategorieId]);


    return (
    <div className='p-4 flex flex-col md:flex-row items-center justify-center min-h-[80vh] md:min-h-auto gap-6 md:gap-0'>
        
        {/* Formulaire centré verticalement */}
        <div className='w-full md:w-[50%] flex flex-col items-center justify-center'>
            <h3 className='text-center font-semibold text-2xl md:text-3xl mb-6'>Étape 3 : Choix</h3>

            {/* Sélecteur de catégorie */}
            <div className='flex flex-col w-full max-w-sm mb-6 items-center'>
                <label htmlFor="categorie" className='mb-2 text-center font-medium'>Sélectionnez une Catégorie :</label>
                <select 
                    id="categorie" 
                    {...register("categorie")} 
                    className='rounded-full p-3 border focus:border-[#8a2be2] focus:ring-[#8a2be2] outline-none transition duration-200 w-full'
                    disabled={isLoading}
                >
                    <option value="">{isLoading ? "Chargement..." : "--- Choisissez une catégorie ---"}</option>
                    {categories.map(c => <option key={c.id} value={String(c.id)}>{c.nom}</option>)}
                </select>
                {errors.categorie && <p className='text-sm text-red-500 mt-1 text-center'>{errors.categorie.message}</p>}
            </div>

           {/* Bloc Services */}
            <div className='flex flex-col w-full max-w-sm mb-6'>
                <label className='mb-2 text-center md:text-left font-medium'>Choisissez les services qui vous conviennent :</label>
                
                {categorieWatch && offres.length > 0 ? (
                    <div className='flex flex-col space-y-2 w-full'>
                        {offres.map(item => (
                            <div key={item.id} className='flex items-center w-full'>
                                <input 
                                    type="checkbox" 
                                    id={`service-${item.id}`} 
                                    value={item.id} 
                                    className='text-[#8a2be2] focus:ring-[#8a2be2] rounded' 
                                    {...register("service")} 
                                />
                                <label htmlFor={`service-${item.id}`} className='ml-2 flex-1 cursor-pointer'>{item.nom}</label>
                            </div>
                        ))}
                    </div>
                ) : categorieWatch ? (
                    <p className='text-sm italic text-gray-600 text-center md:text-left'>Aucun service trouvé pour cette catégorie.</p>
                ) : (
                    <p className='text-sm italic text-gray-600 text-center md:text-left'>Sélectionnez une catégorie pour voir les services disponibles.</p>
                )}

                {errors.service && <p className='text-sm text-red-500 mt-2 text-center md:text-left'>{errors.service.message}</p>}
            </div>


            {/* Boutons */}
            <div className='flex sm:flex-row justify-center gap-4 w-full max-w-sm'>
                <button
                    type='button'
                    className="flex items-center justify-center gap-2 px-4 py-1 sm:px-6 sm:py-3 rounded-full text-white font-semibold 
                    bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] hover:from-[#6c63ff] hover:to-[#8a2be2] 
                    shadow-lg transition-colors duration-300 cursor-pointer w-15 h-15 sm:w-full sm:h-auto"
                    onClick={handlePrevious}
                >
                    <FaArrowLeft /> 
                    <span className="hidden sm:inline">Précédent</span>
                </button>

                <button
                    type='button'
                    className="flex items-center justify-center gap-2 px-4 py-1 sm:px-6 sm:py-3 rounded-full text-white font-semibold 
                    bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] hover:from-[#6c63ff] hover:to-[#8a2be2] 
                    shadow-lg transition-colors duration-300 cursor-pointer w-15 h-15 sm:w-full sm:h-auto"
                    onClick={handleNext}
                >
                    <span className="hidden sm:inline">Suivant</span> 
                    <FaArrowRight />
                </button>
            </div>
        </div>

        {/* Image — cachée sur mobile */}
        <div className='hidden md:flex w-full md:w-[50%] justify-center mt-6 md:mt-0'>
            <img src={choix} alt="Illustration de choix" className='max-w-full h-auto' />
        </div>
    </div>
)
}

export default Step3