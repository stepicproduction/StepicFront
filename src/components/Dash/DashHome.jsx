import React, { useState, useEffect, Suspense, lazy } from "react";
import { FaBox, FaUserGraduate, FaShoppingCart, FaComments } from "react-icons/fa";
import { getData } from "@/service/api";
const DashCharts = lazy(() => import("./DashCharts"));

const SERVICE_COLORS = {
  "Formation en langue Française": "#4F46E5",  // Indigo
  "Formation en langue Anglaise": "#10B981",   // Vert
  "Formation en langue Allemande": "#F59E0B",  // Orange
  "Formation en langue Chinoise (Mandarin)": "#EF4444",          // Rouge
  "Formation en Informatique, Bureautique (Bureautique plus inclut) et Outils Internet": "#3B82F6",      // Bleu
};
const COLORS_TEMOIGNAGES = ["#82ca9d", "#d9534f"];

const DashHome = () => {
    // 1. Initialiser les états pour toutes les données
    const [commandesData, setCommandesData] = useState([]);
    const [inscriptionsData, setInscriptionsData] = useState([]);
    const [temoignagesData, setTemoignagesData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Initialisation des counts API avec un objet vide
    const [offre, setOffre] = useState({}) 
    const [commande, setCommande] = useState({})
    const [inscription, setInscription] = useState({})
    const [temoignage, setTemoignage] = useState({})
    const [inscriptionByService, setInscriptionByService] = useState([])

    //navigation

    //Récupération des nombres de services
    const fetchNbOffre = async () => {
      try {
        const response = await getData("/services/count/")
        console.log(response.data)
        setOffre(response.data) // response.data est l'objet {total_services: X}
      } catch (err) {
        console.log("Erreur lors de la récupération des nombres des offres : ", err);
      }
    }

    //Récupération des nombres de commandes
    const fetchNbCommande = async () => {
      try {
        const response = await getData("/commandes/count/")
        console.log(response.data)
        setCommande(response.data) // response.data est l'objet {total_commande: X}
      } catch (err) {
        console.log("Erreur lors de la récupération des nombres des commandes : ", err);
      }
    }

    //Récupération des nombres d'inscriptions
    const fetchNbInscription = async () => {
      try {
        const response = await getData("/inscriptions/count/")
        console.log(response.data)
        setInscription(response.data) // response.data est l'objet {total_inscription: X}
      } catch (err) {
        console.log("Erreur lors de la récupération des nombres des inscriptions : ", err);
      }
    }

    //Récupérations des nombres de temoignages en attente
    const fetchNbTemoingagneAttente = async () => {
      try {
        const response = await getData("/temoignages/count/en_attente/")
        console.log(response.data)
        setTemoignage(response.data) // response.data est l'objet {temoignage_en_attente: X}
        return response.data
      } catch (err) {
        console.log("Erreur lors de la récupération des nombres des temoignages en attente : ", err);
      }
    }

    //Récupérations dess nombres de temoignages validés
    const fetchNbTemoignageValide = async () => {
        try {
            const response = await getData("/temoignages/count/valide/")
            return response.data
        } catch (err) {
            console.log("Erreur lors de la récupération des nombres des temoignages validés : ", err)
        }
    }

    //Récupérations des données de commande par mois
    const fetchCommandeParMois = async () => {
        try {
            const response = await getData("/commandes/by_month/")
            console.log(response.data.commandes)
            return response.data.commandes
        } catch (err) {
            console.log("Erreur lors de la récupération des données concernant les commandes par mois : ", err)
        }
    }

    //récupération des données concernant le nombre d'inscriptions par mois en une année
    const fetchNbInscriptionParMois = async () => {
        try {
            const response = await getData("/inscriptions/by_month/")
            console.log(response.data.inscriptions);
            return response.data.inscriptions
        } catch (err) {
            console.log("Erreur lors de la récupération des données concernant les inscriptions par mois : ", err);
        }
    }

    //formatter l'information des commandes par mois en barchart
    const fetchAndFormatCommande = async () => {
        try {
            const rawData = await fetchCommandeParMois()

            const formattedData = rawData.map(item => ({
                mois: item.libelle,
                commandes: item.nb_commande,
            }))
            setCommandesData(formattedData)

        } catch (err) {
            console.error("Erreur de formatage des commandes:", err);
            setCommandesData([]);
        }
    }

    //formatter l'information des inscriptions par  mois en linechart
    const fetchAndFormatInscription = async () => {
        try {
            const rawData = await fetchNbInscriptionParMois()

            const formattedData = rawData.map(item => ({
                mois: item.libelle,
                inscriptions: item.nb_inscription,
            }))

            setInscriptionsData(formattedData)

        } catch (err) {
            console.log("Erreur lors du formattage des inscriptions : ", err)
            setInscriptionsData([])
        }
    }

    // formattage des temoignages en pie chart
    const fetchAndFormatTemoignages = async () => {
        try {
            const [attenteRes, valideRes] = await Promise.all([
                fetchNbTemoingagneAttente(),
                fetchNbTemoignageValide()
            ])

            const attenteCount = attenteRes.temoignage_en_attente;
            const valideCount = valideRes.temoignage_valide;

            const formattedData = [
                { 
                    name: "Validés", 
                    value: valideCount 
                },
                { 
                    name: "En attente", 
                    value: attenteCount
                },
            ];

            setTemoignagesData(formattedData);
            return { valideCount, attenteCount };

        } catch (err) {
            console.log("Erreur lors du formatage et de la récupération du témoignage : ", err)
            return { valideCount: 0, attenteCount: 0 };
        }
    }

    //récupérer les nb inscriptions par services
    const fetchInscriptionByService = async () => {
        try {
            const response = await getData("inscriptions/count-by-service/")
            console.log("inscription : ",response.data)
            return response.data
        } catch(err) {
            console.log("Erreur lors de la récupération des données des inscriptions par services : ", err)
        }
    }

    const formatInscriptionByService = async () => {
        try {
            const rawData = await fetchInscriptionByService()

            const formattedData = rawData.dataServices.map(item => ({
                name: item.name,
                value: item.value,
            }))

            setInscriptionByService(formattedData)
        } catch (err) {
            console.log("Erreur lors de la récupération des données : ", err)
            setInscriptionByService([])
        }
    }

    // 2. Fonction de chargement de données
    useEffect(() => {
        // Utilisation de Promise.all pour gérer le chargement global de manière plus fiable
        Promise.all([
            fetchNbOffre(),
            fetchNbCommande(),
            fetchNbInscription(),
            fetchNbTemoingagneAttente(),
            fetchAndFormatTemoignages(),
           fetchAndFormatCommande(),
           fetchAndFormatInscription(),
           formatInscriptionByService(),
        ]).finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-600">
                <p className="animate-pulse">Chargement des données du tableau de bord...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="font-bold text-2xl mb-6">Tableau de bord</h2>

            {/* --- Cards rapides (Utilisent l'état 'stats') --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {/* Offres */}
                <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3">
                    <FaBox className="text-green-500 text-3xl" />
                    <div>
                        <p className="text-sm text-gray-500">Offres</p>
                        <h3 className="text-lg font-bold">{offre.total_services}</h3>
                    </div>
                </div>
                {/* Inscriptions */}
                <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3">
                    <FaUserGraduate className="text-purple-500 text-3xl" />
                    <div>
                        <p className="text-sm text-gray-500">Inscriptions</p>
                        <h3 className="text-lg font-bold">{inscription.total_inscription}</h3>
                    </div>
                </div>
                {/* Commandes */}
                <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3">
                    <FaShoppingCart className="text-red-500 text-3xl" />
                    <div>
                        <p className="text-sm text-gray-500">Commandes</p>
                        <h3 className="text-lg font-bold">{commande.total_commande}</h3>
                    </div>
                </div>
                {/* Témoignages */}
                <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3">
                    <FaComments className="text-yellow-500 text-3xl" />
                    <div>
                        <p className="text-sm text-gray-500">Témoignages</p>
                        <h3 className="text-lg font-bold">{temoignage.temoignage_en_attente} en attente</h3>
                    </div>
                </div>
            </div>
            
            <hr/>

            {/* Chargement différé des graphiques lourds */}
            <Suspense fallback={<div className="h-64 flex items-center justify-center">Chargement des graphiques...</div>}>
                <DashCharts 
                    inscriptionByService={inscriptionByService}
                    SERVICE_COLORS={SERVICE_COLORS}
                    temoignagesData={temoignagesData}
                    COLORS_TEMOIGNAGES={COLORS_TEMOIGNAGES}
                    commandesData={commandesData}
                    inscriptionsData={inscriptionsData}
                />
            </Suspense>
        </div>
    );
};

export default DashHome;