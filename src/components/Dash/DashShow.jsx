import React, { useState, useEffect } from "react";
import { PlayCircle, Film, Link as LinkIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getData, updateData, createData } from "@/service/api";
import ModifierShowreelModal from "./Modals/showreels/ModifierShowreelModal";
import { P } from "../Typographie";

function DashShow() {
  
  const [editMode, setEditMode] = useState(false);
  const [url, setUrl] = useState([])

  //récupérer les données concernant le Showrell
  const fetchShowreel = async () => {
    try {
      const response = await getData("/showreels/")
      console.log(response.data);
      setUrl(response.data[0])
    } catch (err) {
      console.log("Erreur lors de la récupération des données concernant le showreel : ", err)
    }
  }

  useEffect(() => {
    fetchShowreel()
  }, [])

  /**
   * Fonction utilitaire pour tenter de convertir une URL YouTube standard en URL d'intégration (embed).
   */

  const handleCreate = async (data) => {
    console.log(data)
    try {
      await createData(`/showreels/`, data)
      fetchShowreel()
      toast.success("Ajout avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de la création du showreel : ", err)
      toast.error("Erreur lors de la création du showreel", {duration : 3000})
    }
  }

  const handleSave = async (updatedData) => {
    console.log(updatedData)
    try {
      await updateData(`/showreels/${updatedData.id}/`, updatedData)
      fetchShowreel()
      toast.success("Modification avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors du mise à jour du showreel : ", err)
      toast.error("Erreur lors de la mise à jour du showreel", {duration : 3000})
    }
  };
  

  return (
    <div className="p-8 bg-white min-h-screen rounded-xl shadow-lg">

      <Toaster position="top-right" reverseOrder={false} />
      
      {/* --- HEADER --- */}
      <header className="flex items-center gap-3 mb-8 border-b border-red-400/30 pb-4">
        <Film className="h-8 w-8 text-red-600" /> 
        <h2 className="font-semibold text-4xl text-gray-800 tracking-wide">
          Configuration du Showreel
        </h2>
      </header>

      {/* --- Vidéo actuelle (Affichage de l'URL seule) --- */}
      { url ? <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 mb-8">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-700 mb-4">
                    <PlayCircle className="h-6 w-6 text-red-500" />
                    Vidéo actuelle : {url.title} ({url.description})
                </h3>
                
                {/* Bloc d'affichage de l'URL */}
                <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg border border-gray-200 break-words max-w-full">
                    <LinkIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="font-mono text-blue-700 break-all">{url.link}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-6">Ceci est l'URL d'intégration (embed) utilisée sur le site.</p>
            </div>
          </div>
      </div> : <p className="mb-8">Aucun lien n'est ajouté pour le moment !</p>}

      <ModifierShowreelModal value={url} onUpdate={handleSave} onCreate={handleCreate}/>
    </div>
  );
}

export default DashShow;
