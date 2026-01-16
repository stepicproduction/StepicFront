import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader, Check, ArrowRight, Sparkles, X } from "lucide-react";
import { createData } from '@/service/api';

const schema = z.object({
  nomClient: z.string().min(3, "Nom requis"),
  emailClient: z.string().email("Email invalide"),
  sujet: z.string().min(1, "Offre requise"),
  contenu: z.string().min(5, "Détaillez votre besoin"),
});

const DemandeDevis = ({ offres }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await createData("messages/", data);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
        reset();
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Section pleine largeur sans padding latéral excessif */
    <section className="mt-8 w-full bg-white relative overflow-hidden border-t border-gray-100">
      
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* --- BANNIÈRE CTA PLEINE LARGEUR --- */
          <motion.div
            key="cta-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full py-24 px-6 bg-gradient-to-br from-[#8a2be2] to-[#5a1ba0] text-white flex flex-col items-center justify-center text-center"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 3 }}
              className="mb-6 bg-white/20 p-4 rounded-full"
            >
              <Sparkles size={40} className="text-white" />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              Prêt pour l'ascension ?
            </h2>
            <p className="text-purple-100 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mb-12 font-medium">
              Transformez vos idées en résultats concrets. Nos experts sont prêts à propulser votre projet vers le sommet.
            </p>

            <button
              onClick={() => setIsOpen(true)}
              className="group bg-white text-[#8a2be2] px-4 py-3 md:px-12 md:py-5 rounded-full font-black text-sm sm:text-base md:text-lg lg:text-xl shadow-2xl hover:scale-105 transition-all flex items-center gap-4"
            >
              Obtenir mon devis gratuit
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
            
            <div className="mt-12 text-xs font-bold tracking-[0.4em] opacity-40 uppercase">
              "Chaque pas nous rapproche du pic"
            </div>
          </motion.div>
        ) : (
          /* --- FORMULAIRE PLEINE LARGEUR --- */
          <motion.div
            key="form-full"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full min-h-[600px] flex flex-col lg:flex-row"
          >
            {/* Colonne de gauche : Identité visuelle */}
            <div className="lg:w-1/3 bg-gray-50 p-12 flex flex-col justify-center border-r border-gray-100">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-1 left-1 p-3 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-[#8a2be2]"
                >
                    <X size={24} />
                </button>
                
                <h3 className="text-3xl sm:text-5xl font-black text-gray-900 leading-none mb-6">
                    LANCEZ <br/><span className="text-[#8a2be2]">LE PROJET.</span>
                </h3>
                <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed">
                    Remplissez ces quelques informations. Nous analysons votre demande et revenons vers vous avec une stratégie sur-mesure.
                </p>
            </div>

            {/* Colonne de droite : Champs de saisie */}
            <div className="lg:w-2/3 p-4 md:p-24 bg-white flex items-center">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        
                    {/* Champ Nom Complet */}
                    <div className="relative group">
                        <input 
                            {...register("nomClient")} 
                            className="peer w-full border-0 border-b-2 border-gray-200 py-3 px-2 outline-none transition-all duration-300 bg-transparent placeholder-transparent 
                            focus:border-[#8a2be2] focus:border-2 focus:ring-4 focus:ring-purple-50 focus:rounded-lg" 
                            placeholder="Nom" 
                        />
                        <label className="absolute left-2 top-3 text-gray-400 capitalize transition-all duration-300 pointer-events-none
                            peer-placeholder-shown:text-base 
                            peer-focus:-top-2 peer-focus:bg-white peer-focus:text-sm peer-focus:text-[#8a2be2] peer-focus:font-bold
                            peer-not-placeholder-shown:-top-7 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-[#8a2be2]">
                            Nom complet
                        </label>
                        {errors.nomClient && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.nomClient.message}</p>}
                    </div>

                    {/* Champ Email */}
                    <div className="relative group">
                        <input 
                            {...register("emailClient")} 
                            className="peer w-full border-0 border-b-2 border-gray-200 py-3 px-2 outline-none transition-all duration-300 bg-transparent placeholder-transparent 
                            focus:border-[#8a2be2] focus:border-2 focus:ring-4 focus:ring-purple-50 focus:rounded-lg" 
                            placeholder="Email" 
                        />
                        <label className="absolute left-2 top-3 text-gray-400 capitalize transition-all duration-300 pointer-events-none
                            peer-placeholder-shown:text-base 
                            peer-focus:-top-2 peer-focus:bg-white peer-focus:text-sm peer-focus:text-[#8a2be2] peer-focus:font-bold
                            peer-not-placeholder-shown:-top-7 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-[#8a2be2]">
                            Votre email
                        </label>
                        {errors.emailClient && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.emailClient.message}</p>}
                    </div>

                    {/* Sélecteur de Service */}
                    <div className="md:col-span-2 relative group">
                        <label className="text-sm font-bold text-[#8a2be2] capitalize block mb-3 ml-2">Service souhaité</label>
                        <select 
                            {...register("sujet")} 
                            className="w-full py-4 px-6 bg-gray-50 rounded-xl border-2 border-transparent outline-none font-bold text-[#8a2be2] cursor-pointer appearance-none transition-all hover:bg-purple-50 focus:border-[#8a2be2] focus:ring-4 focus:ring-purple-50"
                        >
                            {offres?.map(o => <option key={o.id} value={o.nom}>{o.nom}</option>)}
                            <option value="Autre">Autre demande</option>
                        </select>
                    </div>

                    {/* Champ Message / Contenu */}
                    <div className="md:col-span-2 relative group">
                        <textarea 
                            {...register("contenu")} 
                            rows="3" 
                            className="peer w-full border-0 border-b-2 border-gray-200 py-3 px-2 outline-none transition-all duration-300 bg-transparent placeholder-transparent resize-none
                            focus:border-[#8a2be2] focus:border-2 focus:ring-4 focus:ring-purple-50 focus:rounded-lg" 
                            placeholder="Message" 
                        />
                        <label className="absolute left-2 top-3 text-gray-400 capitalize transition-all duration-300 pointer-events-none
                            peer-placeholder-shown:text-base 
                            peer-focus:-top-2 peer-focus:bg-white peer-focus:text-sm peer-focus:text-[#8a2be2] peer-focus:font-bold
                            peer-not-placeholder-shown:-top-7 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-[#8a2be2]">
                            Détails du projet
                        </label>
                    </div>

                    {/* Bouton de Soumission */}
                    <div className="md:col-span-2 pt-6">
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="px-6 py-3 bg-[#8a2be2] text-white rounded-full font-black text-lg hover:bg-[#8a2be2] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
                        >
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.span key="l" initial={{ y: 20 }} animate={{ y: 0 }} className="flex items-center justify-center gap-3">
                                        <Loader className="animate-spin" /> Analyse...
                                    </motion.span>
                                ) : success ? (
                                    <motion.span key="s" initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-3 text-green-400">
                                        <Check /> Envoyé !
                                    </motion.span>
                                ) : (
                                    <motion.span key="n" className="flex items-center justify-center gap-3">
                                        Envoyer <Send size={20}/>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default DemandeDevis;