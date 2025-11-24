import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    Star, CheckCircle, XCircle, Trash2, Search, Filter, 
    MessageSquare, AlertTriangle, ChevronDown, Loader2,
    Calendar
} from 'lucide-react';
import { deleteData, getData, updateData } from '@/service/api';
import toast, { Toaster } from "react-hot-toast";
import { getRelativeTime } from '@/service/getRelativeTime';

// --- Composants UI de base ---
const Button = ({ children, onClick, variant = 'default', className = '', size = 'md', title = '', disabled = false, type = 'button' }) => {
    let baseStyle = 'px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm shadow-sm flex items-center justify-center border';
    if (size === 'icon') baseStyle = 'p-2 rounded-full transition-all duration-200 shadow-none border-none';
    
    const variants = {
        default: 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400',
        outline: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:text-gray-400',
        ghost: 'text-gray-600 border-transparent hover:bg-gray-100 disabled:text-gray-400',
        danger: 'bg-red-500 text-white border-red-500 hover:bg-red-600 disabled:bg-red-400',
    };

    const disabledStyle = disabled ? 'opacity-70 cursor-not-allowed' : '';
    
    return (
        <button
            type={type}
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant] || variants.default} ${className} ${disabledStyle}`}
        >
            {children}
        </button>
    );
};

const Input = ({ type = 'text', placeholder, value, onChange, className = '' }) => (
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${className}`}
    />
);

// --- Composant Modal de Confirmation ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, clientName, clientId }) => {
    if (!isOpen) return null;

    const deleteClient = () => {
        onConfirm(clientId)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-70 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 transform transition-all duration-300 shadow-2xl">
                <div className="flex flex-col items-center">
                    <div className="p-3 bg-red-100 rounded-full mb-4">
                        <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmation Requise</h3>
                    <p className="text-sm text-gray-500 text-center mb-6">
                        Êtes-vous sûr de vouloir supprimer définitivement le témoignage de <span className="font-semibold text-red-600">{clientName}</span> ?
                    </p>
                    <div className="flex space-x-3 w-full">
                        <Button 
                            variant="outline" 
                            className="w-1/2" 
                            onClick={onClose}
                        >
                            Annuler
                        </Button>
                        <Button 
                            variant="danger" 
                            className="w-1/2" 
                            onClick={deleteClient}
                        >
                            Supprimer
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Composant pour afficher les étoiles
const StarRating = ({ rating }) => (
    <div className="flex space-x-0.5">
        {[1, 2, 3, 4, 5].map(star => (
            <Star 
                key={star}
                className={`w-4 h-4 transition-colors ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-100'}`} 
            />
        ))}
    </div>
);

// Composant pour l'affichage du statut
const StatutBadge = ({ statut }) => {
    let colorClass = '';
    let text = '';
    let Icon;
    
    switch (statut) {
        case 'Validé':
            colorClass = 'bg-green-100 text-green-700';
            text = 'Validé';
            Icon = CheckCircle;
            break;
        case 'En attente':
            colorClass = 'bg-yellow-100 text-yellow-700';
            text = 'En Attente';
            Icon = AlertTriangle;
            break;
        default:
            colorClass = 'bg-gray-100 text-gray-700';
            text = 'Inconnu';
            Icon = XCircle;
    }
    
    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-md flex items-center ${colorClass}`}>
            <Icon className='w-3 h-3 mr-1' />
            {text}
        </span>
    );
};

// --- Composant de Card pour un Témoignage (Amélioration du Design) ---
const TestimonialCard = ({ temoin, onStatutChange, onMiseEnAvant, onConfirmDelete }) => {
    const isFeatured = temoin.mis_en_avant && temoin.statut === 'validé';

    const initial = temoin.emailClient ? temoin.emailClient[0].toUpperCase() : temoin.nomClient ? temoin.nomClient[0].toUpperCase() : "?"

    return (
        <div 
            className={`
                bg-white p-5 rounded-xl shadow-lg border-t-4 transition-all duration-300 
                ${isFeatured 
                    ? 'border-indigo-500 shadow-2xl ring-4 ring-indigo-50' 
                    : temoin.valide === 'en attente' 
                        ? 'border-yellow-300 hover:shadow-xl' 
                        : 'border-gray-100 hover:shadow-xl'}
                flex flex-col h-full
            `}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3"
                >
                    <div className={`rounded-full flex items-center justify-center text-white font-bold`}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius : "50%",
                            backgroundColor: temoin.image ? "transparent" : "#4F46E5", 
                        }}
                    >
                    {temoin.image ?
                     <img 
                        className='h-12 w-12 rounded-full object-cover border-2 border-gray-100 shadow-sm' 
                        src={temoin.image} 
                        alt={temoin.nomClient} 
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/94a3b8/FFFFFF?text=?" }}
                    /> : <span>{initial}</span>}
                    </div>
                    
                    <div className='w-[70%]'>
                        <div className='text-md font-bold text-gray-900'>{temoin.nomClient} {temoin.prenomClient}</div>
                        <StarRating rating={temoin.note} />
                    </div>
                </div>
                <StatutBadge statut={temoin.valide} />
            </div>

            {/* Message */}
            <p className='text-sm text-gray-700 mb-5 flex-grow italic'>
                <span className='text-indigo-400 mr-1'>"</span>
                {temoin.messageClient}
                <span className='text-indigo-400 ml-1'>"</span>
            </p>

            {/* Meta et Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className='text-xs text-gray-500 flex items-center'>
                    <Calendar className='w-3 h-3 mr-1' />
                    {getRelativeTime(temoin.dateTem)}
                </div>
                
                {/* Actions */}
                <div className='flex space-x-1'>
                    
                    {/* Action: Validation */}
                    {temoin.valide === 'En attente' && (
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-green-500 hover:bg-green-100 cursor-pointer"
                            onClick={() => onStatutChange(temoin.id, 'validé')}
                            title="Valider"
                        >
                            <CheckCircle className='w-5 h-5' />
                        </Button>
                    )}
                    
                    {/* Action: Mise en avant */}
                    <Button 
                        variant="ghost"
                        size="icon"
                        disabled={temoin.valide !== 'validé'}
                        className={`
                            ${isFeatured 
                                ? 'text-amber-500 fill-amber-500 hover:bg-amber-100' 
                                : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'}
                        `}
                        onClick={() => onMiseEnAvant(temoin.id, temoin.mis_en_avant, temoin.statut)}
                        title={isFeatured ? "Retirer la mise en avant" : "Mettre en avant"}
                    >
                        <Star className={`w-5 h-5 transition-colors ${isFeatured ? 'fill-current' : 'fill-none'}`} />
                    </Button>

                    {/* Action: Suppression */}
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onConfirmDelete(temoin.id, temoin.nomClient)}
                        title="Supprimer"
                    >
                        <Trash2 className='w-5 h-5' />
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Composant principal
const DashTemoin = () => {
    const [temoins, setTemoins] = useState([]);
    
    const [filterText, setFilterText] = useState('');
    const [filterStatut, setFilterStatut] = useState('tous'); 
    const [loading, setLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [clientNameToDelete, setClientNameToDelete] = useState('');
    const [temoinAttente, setTemoinAttente] = useState([])
    const [temoinValide, setTemoinValide] = useState([])
    const [displayTemoins, setDisplayTemoins] = useState([]);
    
    const fetchTemoins = useCallback(async () => {
        setLoading(true);
        const response = await getData("/temoignages/")
        console.log(response.data)
        setTemoins(response.data)
        setDisplayTemoins(response.data);
        setLoading(false);
    }, []);

    const fetchTemoinEnAttente = async () => {
        try {
            const response = await getData("temoignages/en_attente/")
            console.log(response.data)
            setTemoinAttente(response.data)
        } catch (err) {
            console.log("Erreur lors de la récupération des témoignages en attente : ", err)
        }
    }

    const fetchTemoinValide = async () => {
        try {
            const response = await getData("temoignages/valide/")
            console.log(response.data)
            setTemoinValide(response.data)
        } catch (err) {
            console.log("Erreur lors de la récupération des témoignages validés : ", err)
        }
    }

    useEffect(() => {
        fetchTemoins();
        fetchTemoinEnAttente();
        fetchTemoinValide();
    }, []);

    const filteredTemoins = useMemo(() => {
        const lowercasedFilter = filterText.toLowerCase();
        
        // Prioriser l'affichage des éléments en attente et mis en avant (sorting in memory)
        const sorted = [...temoins].sort((a, b) => {
            if (a.valide === 'en attente' && b.valide !== 'en attente') return -1;
            if (a.valide !== 'en attente' && b.valide === 'en attente') return 1;
            return 0;
        });

        return sorted.filter(temoin => {
            const textMatch = (
                (temoin.nomClient && temoin.nomClient.toLowerCase().includes(lowercasedFilter)) ||
                (temoin.messageClient && temoin.messageClient.toLowerCase().includes(lowercasedFilter))
            );
            
            const statutMatch = filterStatut === 'tous' || temoin.valide === filterStatut;
            
            return textMatch && statutMatch;
        });
    }, [temoins, filterText, filterStatut]);

    const handleStatutChange = async (id) => {
        try {
            await updateData(`temoignages/${id}/valider_temoin/`)
            fetchTemoins()
            toast.success("Temoignage validé avec succès.", {duration : 3000})
        } catch (err) {
            console.log("Erreur lors de la validation du temoignage : ", err)
            toast.error("Erreur lors de la validation du temoignage !", {duration : 3000})
        }
    };

    const confirmDelete = (id, client) => {
        setItemToDelete(id);
        setClientNameToDelete(client);
        setIsModalOpen(true);
    };

    const executeDelete = async (id) => {
        try {
            await deleteData(`temoignages/${id}/`)
            fetchTemoins()
            toast.success("Temoignage supprimé avec succès.", {duration : 3000})
        } catch (err) {
            console.log("Erreur lors de la suppression du temoignage : ", err)
            toast.error("Erreur lors de la suppression du temoignage !", {duration : 3000})
        }
    };
    
    const pendingCount = temoinAttente.length;

    const handleFilterStatut = async (value) => {
        setFilterStatut(value);

        if (value === "tous") {
            setDisplayTemoins(temoins);
        }
        else if (value === "en attente") {
            setDisplayTemoins(temoinAttente);
        }
        else if (value === "validé") {
            setDisplayTemoins(temoinValide);
        }
    };


    return (
        <div className='p-4 sm:p-8 lg:p-10 bg-gray-50 min-h-screen font-sans'>

            <Toaster position="top-right" reverseOrder={false} />

            {/* Modal de Confirmation */}
            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={executeDelete}
                clientName={clientNameToDelete}
                clientId={itemToDelete}
            />

            {/* --- HEADER --- */}
            <header className='flex items-center justify-between mb-8 pb-4 border-b border-gray-200'>
                <div className='flex items-center space-x-3'>
                    <MessageSquare className='w-7 h-7 text-indigo-600' />
                    <h1 className='font-semibold text-4xl text-gray-800 tracking-wide'>Gestion des Témoignages</h1>
                </div>
            </header>


            {/* --- Barre d'outils (Recherche et Filtre) --- */}
            <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm'>
                
                {/* Champ de Recherche */}
                <div className='relative w-full md:w-2/3'>
                    <Input
                        type="text"
                        placeholder="Rechercher (client ou message)..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="pl-10 h-10"
                    />
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                </div>
                
                {/* Filtre par Statut */}
                <div className='relative w-full md:w-1/3'>
                    <Filter className='pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10'/>
                    <select
                        value={filterStatut}
                        onChange={(e) => handleFilterStatut(e.target.value)}
                        className="appearance-none block w-full bg-white border border-gray-300 rounded-lg h-10 py-2 pl-10 pr-10 text-sm text-gray-700 leading-tight focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                    >
                        <option value="tous">Statut (Tous)</option>
                        <option value="en attente">En Attente ({pendingCount})</option>
                        <option value="validé">Validé</option>
                    </select>
                    <ChevronDown className='pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                </div>
            </div>

            {/* --- Affichage en Cartes des Témoignages --- */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {loading ? (
                    <div className="col-span-full text-center py-12 text-indigo-600 font-semibold text-lg bg-white rounded-xl shadow">
                        <Loader2 className='w-6 h-6 animate-spin inline mr-2' />
                        Chargement...
                    </div>
                ) : displayTemoins.length > 0 ? (
                    displayTemoins.map(temoin => (
                        <TestimonialCard 
                            key={temoin.id}
                            temoin={temoin}
                            onStatutChange={handleStatutChange}
                            onConfirmDelete={confirmDelete}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl shadow border-l-4 border-yellow-400">
                        <AlertTriangle className='w-5 h-5 inline mr-2 text-yellow-500' />
                        Aucun témoignage trouvé.
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashTemoin;
