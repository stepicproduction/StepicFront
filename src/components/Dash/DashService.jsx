import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Input } from '../ui/input';
import { Search, Edit, Trash2, HandPlatter, Check, LoaderCircle as Loader  } from "lucide-react"; 
import { Button } from '../ui/button';
import toast, { Toaster } from "react-hot-toast";
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
import { getData, createFormData, updateDataFormData, deleteData } from "@/service/api";
import AjoutServiceModal from "./Modals/service/AjoutServiceModal";
import ModifierServiceModal from "./Modals/service/ModifierServiceModal";
import { motion, AnimatePresence } from 'framer-motion';


function DashService() {
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState("");

  const [loadingPdf, setLoadingPdf] = useState(false)
  const [successPdf, setSuccessPdf] = useState(false)  

  //fetch service data
  const fetchService = async () => {
    try {
      const response = await getData("/services/")
      console.log(response.data)
      setServices(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération des données concernant les offres : ", err);
    }
  }

  const handleCreate = async (data) => {

    const formData = new FormData()

    formData.append("nom", data.nom)
    formData.append("description", data.description)
    formData.append("button", data.button)
    formData.append("categorie", data.categorie)

    if(data.image) {
      formData.append("image", data.image)
    }

    try {
      await createFormData(`/services/`, formData)
      fetchService()
      toast.success("Ajout avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de la création du service : ", err)
      toast.error("Erreur lors de la création du service", {duration : 3000})
    }
  }

  useEffect(() => {
    fetchService()
  }, [])

  const handleDelete = async (id) => {
    try {
      await deleteData(`/services/${id}/`)
      fetchService()
      toast.success("Suppression avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de la suppression du service : ", err)
      toast.error("Erreur lors de la suppression du service", {duration : 3000})
    }
  };

  // Gestion de la sauvegarde des modifications
  const handleSaveEdit = async (updatedData) => {

    const formData = new FormData()

    formData.append("nom", updatedData.nom)
    formData.append("description", updatedData.description)
    formData.append("button", updatedData.button)
    formData.append("categorie", updatedData.categorie)

    if(updatedData.image) {
      formData.append("image", updatedData.image)
    }

    try {
      console.log(updatedData)
      await updateDataFormData(`/services/${updatedData.id}/`, formData)
      fetchService()
      toast.success("Modification avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors du mise à jour du service : ", err)
      toast.error("Erreur lors de la mise à jour du service", {duration : 3000})
    }
  };

  const downloadPdf = async () => { 
    try { 

      setLoadingPdf(true);
      setSuccessPdf(false);

      await getData("/services/pdf_service/") 
      //toast.success("PDF téléchargé avec succès", {duration : 3000})

      setSuccessPdf(true);
      setLoadingPdf(false);

    } catch(err) { 
      console.log("Erreur lors de l'export PDF : ", err) 
      toast.error("Erreur lors du téléchargement du pdf", {duration : 3000})
      setLoadingPdf(false);
    }
  }
  
  // Filtrage
  const filteredServices = services.filter((s) =>
    Object.values(s).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(filter.toLowerCase())
    )
  );
  

  // Suppression des colonnes Prix et Actif/Statut
  const columns = [
    { name: "ID", selector: row => row.id, sortable: true, width: "70px" },
    {
        name: "Image",
        cell: (row) => (
            <img 
                src={row.image} 
                alt={`Image de ${row.title}`} 
                className="w-10 h-10 object-cover rounded-md shadow-sm"
                onError={(e) => {
                    e.target.onerror = null; 
                    /*e.target.src = PLACEHOLDER_IMG;*/
                }}
            />
        ),
        width: "70px",
        ignoreRowClick: true,
    },
    { name: "Nom", selector: (row) => row.nom, sortable: true, grow: 1 },
    { name: "Description", selector: (row) => row.description, grow: 2 },
    { name: "Catégorie", selector: (row) => row.categorie_detail ? row.categorie_detail.nom : "_", sortable: true, grow: 1 },
    { name: "Bouton", selector: (row) => row.button, sortable: true, grow: 1 },
    {
      name: "Actions",
      width: "120px",
      cell: (row) => (
        <div className="flex gap-2">
          {/* Bouton d'Édition (Bleu/Cyan) */}
          <ModifierServiceModal value={row} onUpdate={handleSaveEdit} />
          
          {/* Bouton de Suppression (Rouge) */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                className='bg-rose-600 hover:bg-rose-700 text-white shadow-lg rounded-full h-8 w-8 p-1 transition-all'
                size="icon"
                title="Supprimer le service"
              > 
                <Trash2 className='h-4 w-4' /> 
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white text-gray-400" >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-rose-600">Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Voulez-vous supprimer le service <b>{row.nom}</b>? Cette action est irréversible.
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

  const customStyles = {
        headCells: {
            style: {
                fontSize: "0.9rem",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "#4b5563", // gray-600
                paddingLeft: '16px',
                paddingRight: '16px',
                backgroundColor: '#f9fafb', // fond léger pour l'entête
            },
        },
        rows: {
            style: {
                minHeight: '72px', // Augmente la hauteur de la ligne
                fontSize: '14px',
                fontWeight: 400,
                color: '#1f2937', // gray-800
                backgroundColor: 'white',
                marginTop: '4px', // Crée un léger espacement entre les lignes
                marginBottom: '4px',
                borderRadius: '8px', // Optionnel : arrondit les lignes si combiné avec un margin
                borderBottom: '1px solid #f3f4f6 !important',
                '&:hover': {
                    backgroundColor: '#f3f4f6', // Effet de survol plus doux
                    cursor: 'pointer',
                    transition: '0.2s',
                },
            },
        },
        cells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
            },
        },
    }; 

  return (
    <div className="p-8 bg-white min-h-screen rounded-xl shadow-lg">

      <Toaster position="top-right" reverseOrder={false} />
      
      {/* --- HEADER --- */}
      <header className="flex items-center gap-3 mb-8 border-b border-indigo-400/30 pb-4">
        <HandPlatter className="h-8 w-8 text-indigo-600" /> 
        <h2 className="font-semibold text-4xl text-gray-800 tracking-wide">
          Partie Services
        </h2>
      </header>

      {/* --- Barre recherche --- */}
      <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center mb-6 gap-10">

        <AjoutServiceModal onCreate={handleCreate} />
        
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un service..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 h-10 rounded-lg border-gray-300 focus:ring-indigo-500 text-gray-700"
          />
        </div>
        <button
          type="button"
          disabled={loadingPdf}
          onClick={downloadPdf}
          className={`
            relative flex items-center justify-center gap-2
            px-5 py-2.5 rounded-xl
            text-gray-800 font-medium
            bg-gray-100 hover:bg-gray-200
            shadow-sm
            transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
          `}
        >
          <AnimatePresence mode="wait">

            {/* État normal */}
            {!loadingPdf && !successPdf && (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <span className="text-xl">📄</span>
                <span>PDF à télécharger</span>
                <span className="text-xl">📜</span>
              </motion.span>
            )}

            {/* Loading */}
            {loadingPdf && (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Loader size={18} />
                </motion.span>
                <span>Génération…</span>
              </motion.span>
            )}

            {/* Succès */}
            {successPdf && (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 text-green-600"
              >
                <Check size={20} />
                <span>Téléchargé avec succès</span>
              </motion.span>
            )}

          </AnimatePresence>
        </button>
      </div>

      {/* --- Tableau --- */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow">
        <DataTable
          title={<h3 className='text-xl font-semibold text-gray-700'>Liste des services disponibles</h3>}
          columns={columns}
          data={filteredServices}
          pagination
          highlightOnHover
          striped
          responsive
          className="rounded-xl"
          customStyles={customStyles}
        />
      </div>


    </div>
  );
}

export default DashService;
