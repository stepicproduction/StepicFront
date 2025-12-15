import React, { useState, useMemo, useEffect } from "react";
import { Mail, Trash2, Eye, Inbox, MessageSquare, Clock, UserCheck, Send, Reply} from "lucide-react"; 
import DataTable from "react-data-table-component";
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from '../ui/dialog';
import toast, { Toaster } from "react-hot-toast";
import { getData, deleteData, updateData } from "@/service/api";
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

function DashMessage() {
    // Simuler la date d'aujourd'hui
    const today = new Date().toISOString().slice(0, 10); 

    const [messages, setMessages] = useState([]);

    const [showResponseArea, setShowResponseArea] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpenResponse = () => {
        setLoading(true);

        // Attendre 2 secondes avant d'afficher la zone de réponse
        setTimeout(() => {
            setLoading(false);
            setShowResponseArea(true);
        }, 2000);
    };

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filterStatus, setFilterStatus] = useState("Tous"); // État du filtre

    //récupérer les messages
    const fetchMess = async () => {
        try {
            const response = await getData("/messages/")
            console.log(response.data)
            setMessages(response.data)
        } catch(err) {
            console.log("Erreur lors de la récupération des messages : ", err)
        }
    }

    useEffect(() => {
        fetchMess()
    }, [])

    // --- Fonctions de gestion ---

    const handleViewMessage =  async (message) => {
        // Marquer le message comme "Lu"
        try {
            await updateData(`/messages/${message.id}/lu/`)
            fetchMess()
            setSelectedMessage(message);
            toast.success("Le message a été lu", {duration : 3000})
        } catch (err) {
            console.log("Erreur lors du mise à jour : ", err)
            toast.error("Une erreur est survenue !!!", {duration : 3000})
        }
        // Ouvrir la modale
        //setSelectedMessage(message);
    };
    

    const handleDeleteMessage = async (id) => {
        try {
            await deleteData(`/messages/${id}/`)
            fetchMess()
        } catch(err) {
            console.log("Erreur lors de la suppression du message : ", err)
        }
    };

    // --- Calcul des Statistiques ---
    const stats = useMemo(() => ({
        total: messages.length,
        nonLus: messages.filter(msg => msg.status === "Non lu").length,
        nonLusAujourdhui: messages.filter(msg => msg.status === "Non lu" && msg.date === today).length,
        lus: messages.filter(msg => msg.status === "Lu").length,
    }), [messages, today]);

    // --- Logique de Filtrage du Tableau ---
    const filteredMessages = useMemo(() => {
        switch (filterStatus) {
            case "Non lu":
                return messages.filter(msg => msg.status === "Non lu");
            case "Lu":
                return messages.filter(msg => msg.status === "Lu");
            case "Aujourd'hui":
                return messages.filter(msg => msg.date === today);
            case "Tous":
            default:
                return messages;
        }
    }, [messages, filterStatus, today]);

    const isMessageLong = selectedMessage?.contenu && selectedMessage.contenu.length > 100;

    // --- Styles personnalisés pour le DataTable ---
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

    // --- Définition des colonnes ---
    const columns = [
        { 
            name: "Nom", 
            selector: row => row.nomClient, 
            sortable: true,
            grow: 1.5,
            cell: (row) => (
                <div className="font-semibold text-gray-800">
                    {row.nomClient}
                    <p className="text-xs text-gray-500 font-normal">{row.emailClient}</p>
                </div>
            )
        },
        { 
            name: "Sujet", 
            selector: row => row.sujet,
            sortable: true,
            grow: 2,
            cell: (row) => (
                <div className={row.status === "Non lu" ? "font-bold text-gray-900" : "font-medium text-gray-700"}>
                    {row.sujet}
                </div>
            )
        },
        { 
            name: "Date", 
            selector: row => row.dateMess,
            sortable: true,
            width: "120px",
            cell: (row) => (
                <span className="text-gray-600">
                    {row.date === today ? "Aujourd'hui" : row.dateMess}
                </span>
            )
        },
        { 
            name: "Statut", 
            selector: row => row.statut,
            cell: (row) => (
                <span
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                        row.statut === "Non lu"
                            ? "bg-red-100 text-red-700 border border-red-300"
                            : "bg-green-100 text-green-700"
                    }`}
                >
                    {row.statut}
                </span>
            ),
            width: "120px",
        },
        {
            name: "Actions",
            cell: row => (
                <div className="flex gap-2">
                    {/* Bouton Voir (Style Projet) */}
                    <Button
                        onClick={() => handleViewMessage(row)}
                        className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg rounded-full h-8 w-8 p-1 transition-all'
                        size="icon"
                        title="Voir le message"
                    >
                        <Eye size={16} className="text-white" />
                    </Button>
                    
                    {/* Bouton Supprimer (Style Projet) */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button 
                            className='bg-rose-600 hover:bg-rose-700 text-white shadow-lg rounded-full h-8 w-8 p-1 transition-all'
                            size="icon"
                            title="Supprimer le projet"
                            > 
                            <Trash2 className='h-4 w-4' /> 
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle className="text-rose-600">Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                                Voulez-vous supprimer le projet <b>{row.title}</b>? Cette action est irréversible.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <Button 
                                variant="secondary" 
                                className="rounded-full text-gray-700 hover:bg-gray-200"
                                >
                                Annuler
                                </Button>
                            </AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={() => handleDeleteMessage(row.id)}
                                variant="destructive" 
                                className="rounded-full bg-rose-600 hover:bg-rose-700" 
                            >
                                Confirmer
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ),
            width: "100px",
            ignoreRowClick: true,
            allowOverflow: true,
        },
    ];

    return (
        <div className='p-8 bg-white min-h-screen rounded-xl shadow-lg font-sans'>

            <Toaster position="top-right" reverseOrder={false} />
            
            {/* --- HEADER (Style Projet) --- */}
            <header className="flex items-center gap-3 mb-8 border-b border-indigo-400/30 pb-4">
                <MessageSquare className='w-8 h-8 text-indigo-600' />
                <h2 className="font-semibold text-4xl text-gray-800 tracking-wide">
                    Boîte de Réception
                </h2>
            </header>

          

            {/* --- Tableau des Messages (DataTable) --- */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow">
                <DataTable
                    title={
                        <h3 className="text-xl font-semibold text-gray-700">
                            Liste des Contacts ({filterStatus})
                        </h3>
                    }
                    columns={columns}
                    data={filteredMessages}
                    pagination
                    highlightOnHover
                    striped
                    responsive
                    className="rounded-xl"
                    customStyles={customStyles}
                    noDataComponent={<div className='p-8 text-gray-500 text-lg'>Aucun message trouvé avec le filtre "{filterStatus}".</div>}
                />
            </div>
            

            {/* --- Détail du message (Modale) --- */}
            <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
                <DialogContent className="sm:max-w-[500px] [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-indigo-700 flex items-center gap-2 border-b border-indigo-100 pb-2">
                            <Mail size={24} className="text-indigo-500" /> {selectedMessage?.sujet}
                        </DialogTitle>
                        <DialogDescription asChild>
                            <div className="mt-4 space-y-2 text-gray-700 text-sm">
                                <p>De: <span className="font-bold text-gray-900">{selectedMessage?.nomClient}</span></p>
                                <p>Email: <span className="font-bold text-blue-600 hover:underline">{selectedMessage?.emailClient}</span></p>
                                <p>Reçu le: <span className="font-bold">{selectedMessage?.dateMess === today ? `Aujourd'hui (${selectedMessage?.dateMess})` : selectedMessage?.dateMess}</span></p>
                            </div>
                            
                        </DialogDescription>
                    </DialogHeader>
                    
                    {/* --- Message reçu + Icône d’envoi --- */}
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 max-h-96 overflow-y-auto shadow-inner">
                <p className="text-gray-800 whitespace-pre-line leading-relaxed flex items-start justify-between relative">
                    {/* Contenu du message */}
                    <span className={`${isMessageLong ? 'mr-10' : ''}`}> 
                        {selectedMessage?.contenu}
                    </span>

                    {/* Icône Reply (avec positionnement absolu pour les messages longs) */}
                    <Reply
                        size={isMessageLong ? 24 : 27} // Taille de 24 si long, 27 si court (légèrement réduit)
                        onClick={handleOpenResponse}
                        className={`rounded-full border border-blue-500 text-blue-500 cursor-pointer 
                            transition duration-300 hover:border-blue-700 hover:text-blue-700
                            ${loading ? "opacity-50 pointer-events-none" : ""}

                            // Classes de positionnement conditionnel
                            ${isMessageLong 
                                ? "absolute bottom-0 right-0 p-1" // Position absolue en bas à droite si long, avec un petit padding
                                : "p-2 ml-4 flex-shrink-0"       // Position normale à droite si court, avec un padding standard
                            }`}
                    />
                </p>

                {/* Petit texte “patientez...” */}
                {loading && (
                    <p className="text-blue-600 mt-3 animate-pulse">
                         Veuillez patienter...
                    </p>
                )}
            </div>


            {/* --- Zone de Réponse (Apparaît après clic) --- */}
            {showResponseArea && (
                <div className="animate-fadeIn">
                    {/* Textarea */}
                    <div className="mt-4">
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg 
                                       focus:ring-indigo-500 focus:border-indigo-500 
                                       transition duration-150 ease-in-out text-black"
                            rows="4"
                            placeholder="Écrivez votre réponse ici..."
                        ></textarea>
                    </div>

                    {/* Bouton Répondre */}
                    <div className="flex justify-end mt-4">
                        <Button
                            onClick={() => { /* fonction d'envoi */ }}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full flex items-center gap-2"
                        >
                            <Send size={20} />
                            Répondre
                        </Button>
                    </div>
                </div>
            )}
            
                            </DialogContent>
                        </Dialog>
                    </div>
                );
            }

        export default DashMessage;