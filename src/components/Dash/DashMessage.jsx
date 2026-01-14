import React, { useState, useEffect } from "react";
import { 
    SendHorizonal as Send, 
    Clock, 
    Inbox, 
    Search, 
    ChevronRight, 
    Trash2, 
    CheckCircle2, 
    Eye, 
    Reply,
    MailWarning
} from "lucide-react"; 
import { getRelativeTime } from "@/service/getRelativeTime";
import { Button } from '../ui/button';
import { Toaster, toast } from "react-hot-toast";
import { getData, updateData, deleteData } from "@/service/api";
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
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [responseText, setResponseText] = useState("");
    const [sending, setSending] = useState(false);

    const fetchMess = async () => {
        try {
            const response = await getData("/messages/");
            console.log("Message reçu : ", response.data)
            setMessages(response.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchMess(); }, []);

    const handleSelectMessage = async (msg) => {
        setSelectedMessage(msg);
        setIsPanelOpen(true);
        if (msg.statut === "NON_LU") {
            try {
                await updateData(`/messages/${msg.id}/lu/`);
                setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, statut: 'LU' } : m));
            } catch (err) { console.error(err); }
        }
    };

    const handleSendResponse = async () => {
        if (!selectedMessage || !responseText) return;
        setSending(true);
        try {
             await fetch(`https://stepic-back.onrender.com/api/messages/${selectedMessage.id}/repondre/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body: responseText }),
            });
            toast.success("Réponse envoyée !");
            setResponseText(""); 
            setIsPanelOpen(false);
            fetchMess(); 
        } catch (err) {
            toast.error("Erreur d'envoi");
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Évite d'ouvrir le panel en cliquant sur supprimer
        try {
            await deleteData(`/messages/${id}/`);
            toast.success("Supprimé");
            if (selectedMessage?.id === id) setIsPanelOpen(false);
            fetchMess();
        } catch (err) { toast.error("Erreur"); }
    };

    const filteredMessages = messages.filter(msg => {
        const matchesSearch = msg.nomClient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            msg.sujet.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "ALL" || msg.statut === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // --- NOUVEAU : LOGIQUE DE L'ICÔNE D'ÉTAT ---
    const getStatusIcon = (statut, isSelected) => {
        const iconSize = 18;
        switch (statut) {
            case 'NON_LU': 
                return <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" title="Nouveau message" />;
            case 'LU': 
                return <Eye size={iconSize} className={isSelected ? "text-indigo-200" : "text-gray-400"} title="Message lu" />;
            case 'REPONDU': 
                return <Reply size={iconSize} className={isSelected ? "text-green-300" : "text-green-500"} title="Réponse envoyée" />;
            default: 
                return null;
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden font-sans">
            <Toaster position="top-right" />

            <main className={`flex-1 transition-all duration-500 flex ${isPanelOpen ? 'p-0' : 'p-6'}`}>
                
                {/* LISTE DES MESSAGES */}
                <div className={`transition-all duration-500 flex flex-col h-full ${isPanelOpen ? 'w-1/3 bg-white border-r border-gray-200' : 'w-full'}`}>
                    <div className="p-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Inbox className="text-indigo-600" /> Messages
                        </h2>
                        
                        <div className="flex flex-col gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl outline-none"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {['ALL', 'NON_LU', 'LU', 'REPONDU'].map(s => (
                                    <button 
                                        key={s}
                                        onClick={() => setFilterStatus(s)}
                                        className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider transition-all ${filterStatus === s ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        {s === 'ALL' ? 'Tous' : s.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={`flex-1 overflow-y-auto px-4 pb-10 space-y-3 custom-scrollbar ${isPanelOpen ? '' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 space-y-0'}`}>
                        {filteredMessages.map((msg) => (
                            <div 
                                key={msg.id}
                                onClick={() => handleSelectMessage(msg)}
                                className={`group p-4 rounded-2xl cursor-pointer transition-all duration-300 border h-40 flex flex-col justify-between
                                    ${isPanelOpen && selectedMessage?.id === msg.id
                                        ? 'bg-indigo-600 border-indigo-600 text-white transform scale-[0.98]' 
                                        : 'bg-white border-gray-100 hover:border-indigo-200 shadow-sm'
                                    }`}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selectedMessage?.id === msg.id ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                                                {msg.nomClient.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm line-clamp-1">{msg.nomClient}</h3>
                                                <p className={`text-[10px] ${selectedMessage?.id === msg.id ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                    {msg.dateMess && !isNaN(new Date(msg.dateMess).getTime()) ? getRelativeTime(msg.dateMess) : "Récemment"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className={`text-xs font-medium line-clamp-2 ${selectedMessage?.id === msg.id ? 'text-indigo-100' : 'text-gray-600'}`}>{msg.sujet}</p>
                                </div>
                                
                                {/* BARRE D'ACTIONS BASSE */}
                                <div className="flex justify-between items-center pt-2 border-t border-black/5">
                                    <div className="flex items-center gap-3">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button 
                                                className='bg-rose-600 hover:bg-rose-700 text-white shadow-lg rounded-full h-8 w-8 p-1 transition-all'
                                                size="icon"
                                                title="Supprimer le message"
                                                onClick={(e) => e.stopPropagation()}
                                                > 
                                                <Trash2 className='h-4 w-4' /> 
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-white text-gray-400">
                                                <AlertDialogHeader>
                                                <AlertDialogTitle className="text-rose-600">Confirmer la suppression</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Voulez-vous supprimer le message de <b>{msg.nomClient}</b>? Cette action est irréversible.
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
                                                    onClick={(e) => handleDelete(e, msg.id)}
                                                    variant="destructive" 
                                                    className="rounded-full bg-rose-600 hover:bg-rose-700 text-white" 
                                                >
                                                    Confirmer
                                                </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        {/* AFFICHAGE DE L'ICÔNE D'ÉTAT */}
                                        <div className="transition-all duration-300">
                                            {getStatusIcon(msg.statut, selectedMessage?.id === msg.id)}
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className={selectedMessage?.id === msg.id ? 'text-white' : 'text-gray-300'} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PANEL DE LECTURE */}
                <aside className={`fixed top-0 right-0 h-full bg-white shadow-2xl transition-all duration-500 z-20 flex flex-col ${isPanelOpen ? 'w-2/3 translate-x-0' : 'w-0 translate-x-full opacity-0'}`}>
                    {selectedMessage && (
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                                        {selectedMessage.nomClient.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{selectedMessage.nomClient}</h2>
                                        <p className="text-sm text-gray-500">{selectedMessage.emailClient}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsPanelOpen(false)} className="w-8 h-8 cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-100 hover:border-red-500 rounded-full border border-black">✕</button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                                <div className="max-w-2xl mx-auto">
                                    <h3 className="text-3xl font-black text-gray-900 mb-6">{selectedMessage.sujet}</h3>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 whitespace-pre-wrap text-gray-700">
                                        {selectedMessage.contenu}
                                    </div>
                                    {selectedMessage.statut === "REPONDU" && (
                                        <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-100 font-medium">
                                            <CheckCircle2 size={20}/> Réponse envoyée
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 bg-white border-t">
                                <div className="max-w-2xl mx-auto flex flex-col gap-4">
                                    <textarea 
                                        value={responseText} 
                                        onChange={(e) => setResponseText(e.target.value)} 
                                        className="w-full bg-gray-100 rounded-2xl p-4 min-h-[120px] focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Écrire une réponse..."
                                    />
                                    <Button 
                                        onClick={handleSendResponse}
                                        disabled={sending || !responseText}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white self-end px-8 py-6 rounded-xl gap-2 shadow-lg"
                                    >
                                        {sending ? "Envoi..." : "Envoyer"} <Send size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    );
}

export default DashMessage;