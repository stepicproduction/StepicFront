import React, { useState, useEffect } from "react";
import { SendHorizonal as Send, Clock, Inbox, Search, ChevronRight } from "lucide-react"; 
import { getRelativeTime } from "@/service/getRelativeTime";
import { Button } from '../ui/button';
import { Toaster, toast } from "react-hot-toast";
import { getData, updateData, deleteData } from "@/service/api";

function DashMessage() {
    const today = new Date().toISOString().slice(0, 10);
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [responseText, setResponseText] = useState("");
    const [sending, setSending] = useState(false);



    const fetchMess = async () => {
        try {
            const response = await getData("/messages/");
            setMessages(response.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchMess(); }, []);

    const handleSelectMessage = async (msg) => {
        setSelectedMessage(msg);
        setIsPanelOpen(true);
        if (msg.statut === "Non lu") {
            try {
                await updateData(`/messages/${msg.id}/lu/`);
                fetchMess();
            } catch (err) { console.error(err); }
        }
    };

    //fermer le panel à droite
    const closePanel = () => {
        setIsPanelOpen(false);
        // On attend la fin de l'animation pour vider le message sélectionné
        setTimeout(() => setSelectedMessage(null), 300);
    };

    //filtrer les messages
    const filteredMessages = messages.filter(msg => 
        msg.nomClient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.sujet.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //Envoie de message
    const handleSendResponse = async () => {
        if (!selectedMessage || !responseText) return;

        setSending(true);

       await fetch(`/messages/${selectedMessage.id}/repondre/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: responseText }),
        });

        setSending(false);
        setResponseText(""); 
        setIsPanelOpen(false);
        setSelectedMessage(null);
        fetchMess();

        toast.success("Réponse envoyée avec succès !");
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden font-sans">
            <Toaster position="top-right" />

            {/* --- CONTENEUR PRINCIPAL --- */}
            <main className={`flex-1 transition-all duration-500 ease-in-out flex ${isPanelOpen ? 'gap-0' : 'p-6'}`}>
                
                {/* --- SECTION LISTE (GRID) --- */}
                <div className={`transition-all duration-500 h-full ${isPanelOpen ? 'w-1/3 bg-white border-r border-gray-200' : 'w-full'}`}>
                    <div className="mb-6 px-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Inbox className="text-indigo-600" /> Boîte de réception
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Rechercher..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Grille adaptative */}
                    <div className={`grid gap-4 overflow-y-auto pb-10 custom-scrollbar ${isPanelOpen ? 'grid-cols-1 px-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                        {filteredMessages.map((msg) => (
                            <div 
                                key={msg.id}
                                onClick={() => handleSelectMessage(msg)}
                                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between h-40 shadow-sm
                                    ${selectedMessage?.id === msg.id 
                                        ? 'bg-indigo-600 border-indigo-600 text-white transform scale-[0.98]' 
                                        : 'bg-white border-gray-100 hover:border-indigo-300 hover:shadow-md text-gray-600'
                                    }`}
                            >
                                <div>
                                    <div className="flex gap-3 items-start mb-2">
                                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                                {msg.nomClient.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className={`font-bold truncate ${selectedMessage?.id === msg.id ? 'text-white' : 'text-gray-900'} text-wrap`}>{msg.nomClient}</h3>

                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full 
                                                ${selectedMessage?.id === msg.id ? 'bg-indigo-400 text-white' : 'text-gray-500'}`}>
                                                {msg.dateMess === today ? "Aujourd'hui" : msg.dateMess}
                                            </span>
                                            {msg.statut === "Non lu" && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                                        </div>
                                    </div>
                                    <p className={`text-sm line-clamp-1 mt-1 ${selectedMessage?.id === msg.id ? 'text-indigo-100' : 'text-gray-500'}`}>{msg.sujet}</p>
                                </div>
                                <div className="flex justify-end">
                                    <ChevronRight size={18} className={selectedMessage?.id === msg.id ? 'text-white' : 'text-gray-300'} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- PANEL DE DROITE (CONTENU) --- */}
                <aside 
                    className={`fixed top-0 right-0 h-full bg-white shadow-2xl transition-all duration-500 ease-in-out z-20 flex flex-col
                        ${isPanelOpen ? 'w-2/3 translate-x-0' : 'w-0 translate-x-full opacity-0'}`}
                >
                    {selectedMessage && (
                        <div className="px-6 max-h-[100vh] overflow-y-auto">
                            {/* Header du Panel */}
                            <div className="pt-5 border-b pb-3 border-gray-100 flex items-center justify-between bg-white sticky top-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                        {selectedMessage.nomClient.charAt(0)}
                                    </div>
                                     <div>
                                        <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{selectedMessage.nomClient}</h2>
                                        <p className="text-sm text-gray-500">{selectedMessage.emailClient}</p>
                                    </div>
                                    
                                </div>
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 tracking-widest">
                                    <Clock size={14} />{getRelativeTime(selectedMessage.dateMess)}
                                </div>
                            </div>

                            {/* Corps du message */}
                            <div className="flex-1 overflow-y-auto bg-gray-50/30 mb-7">
                                <div className="bg-white pt-4 rounded-3xl min-h-[300px] overflow-y-auto">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{selectedMessage.sujet}</h3>
                                    <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                                        {selectedMessage.contenu}
                                    </p>
                                </div>
                            </div>

                            {/* répondre */}
                            <div className="bg-gray-100 flex flex-col gap-4 px-10 pt-10 pb-5 rounded-4xl min-h-[300px] overflow-y-auto">
                                <textarea 
                                    name="reponse" 
                                    value={responseText} 
                                    onChange={(e) => setResponseText(e.target.value)} 
                                    cols="30" 
                                    rows="10" 
                                    className="w-full border-none bg-white rounded-2xl text-base" 
                                    placeholder="Entrer votre réponse ici..." 
                                />
                                <Button 
                                    onClick={handleSendResponse}
                                    disabled={sending || !responseText}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 gap-2 shadow-lg shadow-indigo-100"
                                >
                                    Répondre <Send size={18} />
                                </Button>
                            </div>

                            {/* Footer du Panel */}
                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
                                <Button 
                                    variant="outline"
                                    onClick={closePanel}
                                    className="rounded-xl px-8 border-gray-200 text-gray-600 hover:bg-gray-50"
                                >
                                    Fermer
                                </Button>
                               
                            </div>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    );
}

export default DashMessage;