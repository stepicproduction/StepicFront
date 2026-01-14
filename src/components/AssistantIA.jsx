import React, { useState, useRef, useEffect } from 'react';
import { sendToIA } from '@/service/apiIA';
import { MessageCircle, X, Send, Bot, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPOSANT TYPEWRITER INTERNE ---
const Typewriter = ({ text, speed = 20 }) => {
    const [displayedText, setDisplayedText] = useState("");
    const timerRef = useRef(null); // Pour suivre l'intervalle proprement

    useEffect(() => {
        // Sécurité
        if (!text) return;

        // Nettoyage immédiat au cas où un ancien timer tourne encore
        if (timerRef.current) clearInterval(timerRef.current);
        
        setDisplayedText(""); 
        let i = 0;

        // On utilise l'index localement pour éviter les sauts
        timerRef.current = setInterval(() => {
            if (i < text.length) {
                // On utilise la version fonctionnelle de setState pour être sûr de l'état précédent
                setDisplayedText((prev) => text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(timerRef.current);
            }
        }, speed);

        // Nettoyage quand le composant est démonté ou que le texte change
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [text, speed]);

    return <span>{displayedText}</span>;
};


const AssistantIA = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([
        { role: 'bot', text: 'Salama ee ! Je suis l\'assistant intelligent de Stepic. Comment puis-je vous aider aujourd\'hui ?' }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Scroll automatique fluide
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [chat, loading]);

    const handleSend = async () => {
        if (!message.trim() || loading) return;

        const userMsg = { role: 'user', text: message };
        setChat(prev => [...prev, userMsg]);
        const currentMessage = message; // On garde une copie
        setMessage("");
        setLoading(true);

        try {
            const response = await sendToIA({ message: currentMessage });
            setChat(prev => [...prev, { role: 'bot', text: response.data.reply }]);
        } catch (error) {
            // Gestion d'erreur propre
            setChat(prev => [...prev, { 
                role: 'bot', 
                text: "Désolé, je suis un peu surchargé. Veuillez patienter quelques instants avant de réessayer." 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[999]">
            {/* Bouton Bulle */}
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)} 
                className="bg-[#6c63ff] p-4 rounded-full shadow-2xl text-white border-2 border-white flex items-center justify-center relative"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
                    </span>
                )}
            </motion.button>

            {/* Fenêtre de Chat */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="absolute bottom-20 right-0 w-[350px] max-sm:w-[85vw] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#6c63ff] to-[#8b84ff] p-5 text-white">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm flex items-center gap-2">
                                        Stepic Assistant <Sparkles size={14} className="text-yellow-300" />
                                    </h3>
                                    <p className="text-[10px] opacity-90">IA générative connectée</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Zone de conversation */}
                        <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {chat.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                                        m.role === 'user' 
                                        ? 'bg-[#6c63ff] text-white rounded-tr-none shadow-md' 
                                        : 'bg-white text-gray-700 rounded-tl-none border border-gray-100 shadow-sm'
                                    }`}>
                                        {/* On n'anime que le DERNIER message du bot */}
                                        {m.role === 'bot' && i === chat.length - 1 ? (
                                            <Typewriter text={m.text} speed={15} />
                                        ) : (
                                            m.text
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {/* Spinner de chargement (IA réfléchit) */}
                            {loading && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-[#6c63ff] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-[#6c63ff] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-[#6c63ff] rounded-full animate-bounce"></span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium italic">Stepic analyse votre demande...</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Zone de saisie */}
                       {/* Zone de saisie - On utilise items-end pour gérer les sauts de ligne si besoin */}
<div className="p-4 bg-white border-t border-gray-100 shrink-0">
    <div className="flex items-center gap-2 w-full"> 
        {/* L'input est enveloppé pour contrôler sa croissance */}
        <div className="relative flex-1 min-w-0"> 
            <input 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question..." 
                className="w-full bg-gray-50 p-3 pr-2 rounded-xl text-sm border border-transparent focus:border-[#6c63ff] focus:bg-white outline-none transition-all"
                disabled={loading}
            />
        </div>

        {/* Le bouton a une taille fixe (shrink-0) pour ne JAMAIS être caché ou écrasé */}
        <button 
            onClick={handleSend}
            disabled={loading || !message.trim()}
            className="flex-none shrink-0 w-11 h-11 bg-[#6c63ff] rounded-xl text-white hover:bg-[#5a52e0] disabled:opacity-50 disabled:grayscale transition-all shadow-md flex items-center justify-center active:scale-95"
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <Send size={18} className="translate-x-0.5" /> 
            )}
        </button>
    </div>
    <p className="text-[9px] text-gray-400 text-center mt-2 uppercase tracking-tighter">
        Propulsé par Stepic IA
    </p>
</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AssistantIA;