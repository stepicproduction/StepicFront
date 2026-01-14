import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getData } from '@/service/api'; // Ton helper Axios
import logo from '@/assets/LOGO_STEPIC.webp';

const Verification = () => {
    // On initialise à null pour savoir si on a un objet ou rien
    const [etudiant, setEtudiant] = useState(null);
    const [loading, setLoding] = useState(true);
    const [errors, setErrors] = useState(false);

    const { matricule } = useParams();

    const verifierEtudiant = async () => {
        // On s'assure que le chargement est actif au début
        setLoding(true);
        setErrors(false);

        const url = `etudiants/?matricule=${matricule}`;
        
        try {
            // Ton helper getData renvoie l'objet Axios complet
            const response = await getData(url);
            
            // Debug : regarde dans ta console, tu verras un tableau dans .data
            console.log("Données reçues :", response.data);

            // Comme c'est un filtre (?matricule=), Django renvoie une LISTE [ ]
            if (response.data && response.data.length > 0) {
                // ✅ On extrait le PREMIER étudiant de la liste
                setEtudiant(response.data[0]);
            } else {
                // Aucun étudiant trouvé avec ce matricule
                setEtudiant(null);
                setErrors(true);
            }
        } catch (err) {
            console.error("Erreur lors de la vérification :", err);
            setErrors(true);
        } finally {
            // On arrête le chargement quoi qu'il arrive
            setLoding(false);
        }
    };

    useEffect(() => {
        if (matricule) {
            verifierEtudiant();
        }
    }, [matricule]);

    // 1. État : CHARGEMENT
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6c63ff]"></div>
                <p role="status" aria-live="polite" className="text-[#6c63ff] font-medium animate-pulse">Vérification sécurisée en cours...</p>
            </div>
        );
    }

    // 2. État : ERREUR (Matricule inexistant ou serveur crashé)
    if (errors || !etudiant) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center p-8 bg-red-50 border border-red-200 text-red-700 rounded-2xl shadow-lg">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold mb-2">Certificat Invalide</h2>
                    <p>Désolé, aucune étudiante n'est enregistrée avec le matricule <strong>{matricule}</strong>.</p>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    // 3. État : SUCCÈS (Affichage des données)
    return (
        <div className="min-h-screen h-auto mt-[100px] bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden border-t-8 border-green-500">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <img src={logo} alt="Stepic Logo" className="w-28 mx-auto mb-4" />
                        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Vérification Réussie</h2>
                        <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-extrabold tracking-wide shadow-sm">
                            <span className="mr-2">✅</span> ÉTUDIANTE CERTIFIÉE
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nom complet</p>
                            <p className="text-lg font-bold text-gray-800">
                                {etudiant?.nom} {etudiant?.prenom}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Identifiant unique</p>
                            <p className="text-lg font-mono font-bold text-[#6c63ff]">
                                {etudiant?.matricule}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Parcours de formation</p>
                            <p className="text-lg font-bold text-gray-800">
                                {etudiant?.formations?.map((f) => f.nom).join(', ') || 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                        <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-tighter">
                            Cette page confirme que l'étudiant(e) cité(e) ci-dessus a suivi avec succès son parcours au sein de STEPIC.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verification;