import React, { useState, useEffect, useRef } from 'react'
import DataTable from 'react-data-table-component'
import { Input } from '../ui/input'
import { Search, Check, Trash2, Handbag, LoaderCircle as Loader } from 'lucide-react' 
import { Button } from '../ui/button'
import toast, { Toaster } from "react-hot-toast";
import { getData, updateData, createData,  deleteData, getDataPdf } from '@/service/api'
import AjoutCommandeModal from './Modals/commande/AjoutCommandeModal'
import ModifCommandeModal from './Modals/commande/ModifCommandeModal'
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
import { motion, AnimatePresence } from 'framer-motion';


function DashCommand() {
  const [commandes, setCommandes] = useState([])
  const [filter, setFilter] = useState("")
  const [commandeYears, setCommandeYears] = useState([])

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [loadingPdf, setLoadingPdf] = useState(false)
  const [successPdf, setSuccessPdf] = useState(false)
  
  const fetchCommande = async (year) => {
    try {
      const response = await getData(`/commandes/by_year/?annee=${year}`)
      setCommandes(response.data.commandes)
    } catch (err) {
      console.log("Erreur lors de la récupération des données concernant les commandes : ", err);
    }
  }

  const fetchCommandeYear = async () => {
    try {
      const response = await getData(`/commandes/available_years/`)
      console.log(response.data)
      setCommandeYears(response.data.years)
    } catch (err) {
      console.log("Erreur lors de la récupération des années disponibles : ", err);
    }
  }

  useEffect(() => {
    fetchCommande(currentYear)
    fetchCommandeYear()
  }, [])

  useEffect(() => {
      if (selectedYear) {
        fetchCommande(selectedYear)
      }
   }, [selectedYear])

  const handleAdd = async (data) => {
    try {
      await createData("/commandes/", data)
      fetchCommande()
      toast.success("Ajout avec succès", {duration : 3000})
    } catch(err) {
      console.log("Erreur lors de l'ajout : ", err)
      toast.error("Erreur lors de la création de la commande !!!", {duration : 3000})
    }
  }

  const handleSave = async (data) => {
    try {
      await updateData(`/commandes/${data.id}/`, data)
      fetchCommande()
      toast.success("Modification avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors du mise à jour : ", err)
      toast.error("Erreur lors de la mise à jour de la commande !!!", {duration : 3000})
    }
  }

  const downloadPdf = async () => {
    try {

      setLoadingPdf(true);
      setSuccessPdf(false);

      const url = "/commandes/pdf_commande/"
      await getData(url)
      //toast.success("PDF téléchargé avec succès", {duration : 3000})

      setSuccessPdf(true);
      setLoadingPdf(false);

    } catch(err) {
      console.log("Erreur lors de l'export PDF : ", err)
      toast.error("Erreur lors du téléchargement du pdf", {duration : 3000})
      setLoadingPdf(false);
    }
  }


  const filteredCommandes = commandes.filter(comm =>
    comm.nomClient.toLowerCase().includes(filter.toLowerCase()) ||
    comm.prenomClient.toLowerCase().includes(filter.toLowerCase()) ||
    comm.service_detail.map(s => s.nom).join(", ").toLowerCase().includes(filter.toLowerCase()) ||
    comm.dateCommande.toLowerCase().includes(filter.toLowerCase()) ||
    comm.emailClient.toLowerCase().includes(filter.toLowerCase())
  )

  const valider = async (id) => {
    try {
      await updateData(`/commandes/${id}/valider/`)
      await getDataPdf(`/commandes/${id}/pdf/`, `commande_${id}.pdf`); 
      fetchCommande()
      toast.success("Commande validée et e-mail envoyé avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de la validation : ", err);
      toast.error("Erreur lors de la validation de la commande !!!", {duration : 3000})
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteData(`/commandes/${id}/`)
      fetchCommande()
      toast.success("Suppression avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de la suppression : ", err);
      toast.error("Erreur lors de la suppression de la commande", {duration : 3000})      
    }
  }

  const columns = [
    { name: "ID", selector: row => row.id, sortable: true, width: "70px" },
    { name: "Nom", selector: row => row.nomClient, sortable: true },
    { name: "Prénoms", selector: row => row.prenomClient, sortable: true },
    { name: "Email", selector: row => row.emailClient, grow: 2 },
    { name: "Téléphone", selector: row => row.telephone },
    { name: "Catégorie", selector: row => row.categorie_detail ? row.categorie_detail.nom : "-", sortable: true },
    { name: "Service", selector: row => row.service_detail.map(s => s.nom).join(", ") },
    { name: "Date", selector: row => row.dateCommande },
    {
      name: "Statut",
      selector: row => row.statut,
      width: "120px",
      cell: row => {
        let bgColor;
        switch(row.statut) {
          case "Validé": bgColor = "bg-green-500"; break;
          case "Rejeté": bgColor = "bg-rose-500"; break;
          default: bgColor = "bg-amber-500";
        }
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${bgColor}`}>{row.statut}</span>
      }
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            onClick={() => valider(row.id)}
            className="bg-green-500 hover:bg-green-600 text-white shadow-lg rounded-full h-8 w-8 p-1 transition-all"
            size="icon"
            disabled={row.statut !== "En attente"}
          >
            <Check className="h-4 w-4" />
          </Button>

          <ModifCommandeModal value={row} onUpdate={handleSave} />
          
          <AlertDialog>
              <AlertDialogTrigger asChild>
                  <Button 
                      className='bg-rose-600 hover:bg-rose-700 text-white shadow-lg rounded-full h-8 w-8 p-1 transition-all'
                      size="icon"
                  > 
                      <Trash2 className='h-4 w-4' /> 
                  </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white text-gray-400">
                  <AlertDialogHeader>
                      <AlertDialogTitle className="text-rose-600">Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                          Voulez-vous supprimer le membre <b>{row.nomClient} {row.prenomClient}</b> ? Cette action est irréversible.
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
    }
  ]

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
        <Handbag className="h-8 w-8 text-indigo-600" /> 
        <h2 className="font-semibold text-4xl text-gray-800 tracking-wide">
          Partie Commandes
        </h2>
      </header>

      {/* --- Barre recherche + select année + PDF --- */}
      <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center mb-6 gap-10">
        <AjoutCommandeModal onCreate={handleAdd} />

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher par nom, email ou service..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 h-10 rounded-lg border-gray-300 focus:ring-indigo-500 text-gray-700"
          />
        </div>

        {/* --- Select année --- */}
        <div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="h-10 rounded-lg border-gray-300 w-24 focus:ring-indigo-500 text-gray-700 px-3"
          >
            {commandeYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
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
          title={<h3 className='text-xl font-semibold text-gray-700'>Liste des commandes - {selectedYear}</h3>}
          columns={columns}
          data={filteredCommandes}
          pagination
          highlightOnHover
          striped
          responsive
          className="rounded-xl"
          customStyles={customStyles}
        />
      </div>
    </div>
  )
}

export default DashCommand
