import React from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import confirmation from "../../assets/confirmation.webp"
import { useState, useEffect } from 'react'
import { getData, createData } from '@/service/api'

const Step4 = ({ formData, handlePrevious, handleSubmit, isSubmitting }) => {

    // Renommés pour clarté: `categories` est un tableau, `services` est un tableau
    const [categories, setCategories] = useState([])
    const [services, setServices] = useState([])
    const [isLoading, setIsLoading] = useState(true) // Pour gérer l'état de chargement

    // --- Fonctions d'appel API pour charger TOUTES les données ---
    
    // On charge toutes les catégories
    const fetchCategories = async () => {
        try {
            const response = await getData("/categories/with_commande/")
            setCategories(response.data)
        } catch(err) {
            console.error("Erreur lors de la récupération des catégories : ", err);
        }
    }

    // On charge tous les services (offres)
    const fetchServices = async () => {
        try {
            // ATTENTION : Si votre API a un endpoint pour TOUS les services, utilisez-le
            // Sinon, vous devrez faire un appel par ID (voir Option 1 dans la réponse précédente)
            const response = await getData("/services") 
            setServices(response.data)
        } catch(err) {
            console.error("Erreur lors de la récupération des services : ", err)
        }
    }

    // --- Logique de recherche et de formatage ---

    // 1. Recherche du nom lisible de la Catégorie
    const formatCategorie = () => {
        // formData.categorie est l'ID (une string)
        const categorieId = String(formData.categorie); 
        
        // Recherche dans le tableau `categories`
        const found = categories.find(cat => String(cat.id) === categorieId);

        // Si l'objet est trouvé, renvoyer son nom, sinon renvoyer l'ID ou un message d'erreur
        return found ? found.nom : `ID Catégorie: ${categorieId} (Introuvable)`;
    };
    
    // 2. Recherche du nom lisible d'un Service
    // 'serviceId' ici est un ID de service, pas l'objet entier
    const formatServiceName = (serviceId) => {
        // Le serviceId est une string
        const serviceIdString = String(serviceId); 

        // Recherche dans le tableau `services`
        const found = services.find(srv => String(srv.id) === serviceIdString);

        // Si l'objet est trouvé, renvoyer son nom, sinon renvoyer l'ID
        return found ? found.nom : `ID Service: ${serviceIdString} (Introuvable)`;
    };

    // --- useEffect pour le chargement ---
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            // On lance les deux appels en parallèle pour plus de rapidité
            await Promise.all([fetchCategories(), fetchServices()]);
            setIsLoading(false);
        };
        loadData();
    }, [])
    
    // --- Rendu ---
    
    // Le nom de la catégorie à afficher
    const categorieNom = !isLoading ? formatCategorie() : 'Chargement...';

    // Rendu pour les services
    const servicesList = formData.service && formData.service.length > 0 ? (
        <ul className='list-disc list-inside ml-4 mt-1 space-y-1'>
            {formData.service.map((serviceId, index) => (
                // Utiliser la fonction de recherche avec l'ID
                <li key={index} className='text-base'>{formatServiceName(serviceId)}</li>
            ))}
        </ul>
    ) : (
        <p className='text-sm italic text-gray-600'>Aucun service supplémentaire sélectionné.</p>
    );

   return (
    <div className='p-4 flex flex-col md:flex-row items-center justify-center min-h-[80vh] gap-6 md:gap-0'>

        <div className='w-full md:w-[50%] flex flex-col items-center md:items-start justify-center'>
            <h3 className='font-semibold text-2xl md:text-3xl mb-6 text-left w-full'>Étape 4 : Confirmation</h3>

            <div className='bg-gray-50 p-6 rounded-lg shadow-inner mb-8 w-full wrap-break-word text-left'>
                <h4 className='font-bold mb-3 border-b pb-1'>Détails :</h4>
                <p className="mb-2"><strong>Nom :</strong> {formData.nomClient} {formData.prenomClient}</p>
                <p className="mb-2"><strong>Email :</strong> {formData.emailClient}</p>
                <p className="mb-2"><strong>Téléphone :</strong> {formData.telephone}</p>
                <p className="mb-2"><strong>Option Catégorie :</strong> {categorieNom}</p>

                <h5 className='font-bold mt-2'>Services Supplémentaires :</h5>
                {isLoading ? (
                    <p className='text-sm italic text-gray-600'>Chargement des services...</p>
                ) : (
                    servicesList
                )}
            </div>

            <div className='flex  sm:flex-row justify-center gap-4 w-full'>
                <button type='button' className="flex items-center justify-center gap-2 px-4 py-1 sm:px-6 sm:py-3 rounded-full text-white font-semibold 
                    bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] hover:from-[#6c63ff] hover:to-[#8a2be2] 
                    shadow-lg transition-colors duration-300 cursor-pointer w-15 h-15 sm:w-full sm:h-auto" 
                    onClick={handlePrevious}>
                    <FaArrowLeft />
                    <span className="hidden sm:inline">Précédent</span>
                </button>

                <button 
                    type='submit' 
                    disabled={isSubmitting || isLoading}
                    className="flex items-center justify-center gap-2 px-4 py-1 sm:px-6 sm:py-3 rounded-full text-white font-semibold 
                    bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                    shadow-lg transition-colors duration-300 cursor-pointer w-15 h-15 sm:w-full sm:h-auto disabled:opacity-50" 
                    onClick={handleSubmit}>
                    {(isSubmitting || isLoading) ? 'Envoi...' : <>
                    <span className="hidden sm:inline">Confirmer</span>
                     <FaCheckCircle /></>}
                </button>
            </div>
        </div>

        {/* Image visible uniquement sur desktop et tablette */}
        <div className='hidden md:flex w-full md:w-[50%] justify-center'>
            <img src={confirmation} alt="Image de confirmation" className='max-w-full h-auto' />
        </div>
    </div>
  )
}

export default Step4