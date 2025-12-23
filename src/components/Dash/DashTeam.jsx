import React, { useState, useEffect, useMemo } from 'react';
import DataTable from "react-data-table-component";
import { Search, Trash2, Users, Mail } from 'lucide-react'; 
import toast, { Toaster } from "react-hot-toast";

// --- 1. Importations des composants UI (Basé sur Shadcn/ui et vos autres fichiers) ---
// IMPORTANT: Assurez-vous que ces chemins d'accès sont corrects pour votre projet.
import { Button } from '../ui/button'; 
import { Input } from '../ui/input'; 
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '../ui/alert-dialog';
import AjoutModal from './Modals/equipe/AjoutModal';
import ModifModal from './Modals/equipe/ModifModal';
import { getData, createFormData, updateDataFormData, deleteData } from '@/service/api';


function DashTeam() {
    const [teams, setTeams] = useState([]); 
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(false);
    
    const fetchTeams = async () => {
        setLoading(true);
        try {
            const response = await getData("/equipes/")
            console.log(response.data)
            setTeams(response.data)
        } catch (err) {
            console.log("Erreur lors de la récupération des données concernant les équipes : ", err)
        }
        setLoading(false);
    };

    // Simulation de la récupération de données
    useEffect(() => {
        fetchTeams();
    }, []);

    // Logique de Filtrage
    const filteredTeams = useMemo(() => {
        const lowercasedFilter = filterText.toLowerCase();
        if (!lowercasedFilter) return teams;
        
        return teams.filter(member => 
            (member.nom_famille && member.nom_famille.toLowerCase().includes(lowercasedFilter)) ||
            (member.prenoms && member.prenoms.toLowerCase().includes(lowercasedFilter)) || 
            (member.role && member.role.toLowerCase().includes(lowercasedFilter)) ||
            (member.email && member.email.toLowerCase().includes(lowercasedFilter))
        );
    }, [teams, filterText]);

    // --- Fonctions CRUD ---

    const handleCreate = async (data) => {
        console.log("Depuis DashTeam : ", data)

        const formData = new FormData();
        formData.append("nom", data.nom);
        formData.append("prenom", data.prenom);
        formData.append("role", data.role);
        formData.append("email", data.email);
        
        if(data.image) {
            formData.append("image", data.image);
        }

        try {
            await createFormData("equipes/", formData)
            fetchTeams()
            toast.success("Création avec succès", {duration : 3000})
        } catch (err) {
            console.log("Erreur lors de l'ajout de l'équipe : ", err)
            toast.error("Erreur lors de la création de l'équipe", {duration : 3000})
        }
    }

    const handleSave = async (updatedData) => {
        console.log("Depuis DashTeam : ", updatedData)

        const formData = new FormData()
        formData.append("nom", updatedData.nom);
        formData.append("prenom", updatedData.prenom);
        formData.append("role", updatedData.role);
        formData.append("email", updatedData.email)

        if(updatedData.image && updatedData.image instanceof File) {
            formData.append("image", updatedData.image)
        }

        try {
            await updateDataFormData(`equipes/${updatedData.id}/`, formData)
            fetchTeams()
            toast.success("Mise à jour avec succès", {duration : 3000})
        } catch (err) {
            console.log("Erreur lors de la mise à jour de l'équipe : ", err)
            toast.error("Erreur lors de la mise à jour de l'équipe", {duration : 3000})
        }
    };

    const handleDelete = async (memberId) => {
        try {
            await deleteData(`/equipes/${memberId}/`)
            fetchTeams()
            toast.success("Suppression avec succès", {duration : 3000})
        } catch (err) {
            console.log("Erreur lors de la suppression de l'équipe : ", err)
            toast.error("Erreur lors de la suppression de l'équipe", {duration : 3000})
        }
    };

    // --- Styles personnalisés pour le DataTable (Comme dans DashProject) ---
    const customStyles = {
        headCells: {
            style: {
                fontSize: '15px',
                fontWeight: '700',
                color: '#374151',
                backgroundColor: '#f9fafb',
            },
        },
        cells: {
            style: {
                fontSize: '14px',
            },
        }
    };
    
    // --- Définition des Colonnes du DataTable ---
    const columns = [
        { name: "ID", selector: row => row.id, sortable: true, width: "70px" },
        {
            name: "Image",
            cell: (row) => (
                <img 
                    src={row.image} 
                    alt={`${row.prenom} ${row.nom}`} 
                    className='h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm'
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/150x150/cccccc/000000?text=U"; 
                    }}
                />
            ),
            width: "80px",
            ignoreRowClick: true,
        },
        {
            name: "Nom Complet",
            selector: row => `${row.nom} ${row.prenom}`,
            sortable: true,
            grow: 1.5,
            cell: (row) => (
                <div>
                    <span className="font-bold text-gray-900 block">{row.nom}</span>
                    <span className="font-medium text-gray-700 text-sm">{row.prenom}</span>
                </div>
            )
        },
        {
            name: "Rôle / Email",
            selector: row => row.role,
            sortable: true,
            grow: 2.5,
            cell: (row) => (
                <div>
                    <div className='text-sm font-semibold text-blue-700'>{row.role}</div>
                    <div className='flex items-center text-xs text-gray-500 truncate'>
                        <Mail className='w-3 h-3 mr-1' /> {row.email}
                    </div>
                </div>
            )
        },
        {
            name: "Actions",
            width: "120px",
            cell: (row) => (
                <div className="flex gap-2">
                    <ModifModal value={row} onUpdate={handleSave} />
                    {/* Bouton de Suppression (avec AlertDialog) - Style Action Projet */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button 
                                className='bg-rose-600 hover:bg-rose-700 text-white shadow-lg rounded-full h-8 w-8 p-1 transition-all'
                                size="icon"
                                title="Supprimer le membre"
                            > 
                                <Trash2 className='h-4 w-4' /> 
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white text-gray-400">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-rose-600">Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Voulez-vous supprimer le membre <b>{row.prenoms} {row.nom_famille}</b>? Cette action est irréversible.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel asChild>
                                    <Button variant="secondary" className="rounded-full text-gray-700 hover:bg-gray-200">Annuler</Button>
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={() => handleDelete(row.id)}
                                    variant="destructive" 
                                    className="rounded-full bg-rose-600 hover:bg-rose-700 text-white" 
                                >
                                    Confirmer
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];


    return (
        <div className='p-8 bg-white min-h-screen rounded-xl shadow-lg font-sans'>

            <Toaster position="top-right" reverseOrder={false} />
            
            {/* --- HEADER (Style Projet) --- */}
            <header className="flex items-center gap-3 mb-8 border-b border-blue-400/30 pb-4">
                <Users className='w-8 h-8 text-blue-600' />
                <h2 className="font-semibold text-4xl text-gray-800 tracking-wide">
                    Gestion de l'Équipe
                </h2>
            </header>

            {/* --- Barre d'outils (Ajout et Recherche) (Style Projet) --- */}
            <div className="flex justify-between items-center mb-6">
                <AjoutModal onCreate={handleCreate} />
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Rechercher un membre..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="w-full pl-10 h-10 rounded-lg border-gray-300 focus:ring-blue-500 text-gray-700"
                    />
                </div>
            </div>

            {/* --- Tableau des Membres de l'Équipe (DataTable) --- */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow">
                <DataTable
                    title={<h3 className='text-xl font-semibold text-gray-700'>Liste des Membres</h3>}
                    columns={columns}
                    data={filteredTeams}
                    pagination
                    highlightOnHover
                    striped
                    responsive
                    className="rounded-xl"
                    customStyles={customStyles}
                    progressPending={loading}
                    progressComponent={<div className='p-12 text-blue-600 font-semibold'>Chargement...</div>}
                    noDataComponent={<div className='p-8 text-gray-500 text-lg'>Aucun membre d'équipe trouvé.</div>}
                />
            </div>
        </div>
    );
}

export default DashTeam;