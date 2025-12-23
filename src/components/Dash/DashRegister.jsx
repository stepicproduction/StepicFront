import React, { useState, useEffect, useRef } from 'react'
import DataTable from 'react-data-table-component'
import { Input } from '../ui/input'
import { Search, Check, Trash2, X, ClipboardList } from 'lucide-react' 
import { Button } from '../ui/button'
import toast, { Toaster } from "react-hot-toast";
import { deleteData, createData, getData, updateData, getDataPdf} from '@/service/api'
import AjoutInscriptionModal from './Modals/inscription/AjoutInscriptionModal'
import ModifInscriptionModal from './Modals/inscription/ModifInscriptionModal'
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

function DashRegister() {
  // --- Données initiales ---
  const [inscriptions, setInscriptions] = useState([])
  const [filter, setFilter] = useState("")
  const [inscriptionsYear, setInscriptionsYear] = useState([])
  const [selectedYear, setSelectedYear] = useState("") // <-- Ajouté pour le select

  const fetchRegister = async () => {
    try {
      const response = await getData("/inscriptions/")
      setInscriptions(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération des données concernant les inscriptions : ", err);
    }
  }

  const fetchInscriptionsYear = async () => {
    try {
      const response = await getData(`/inscriptions/available_years/`) 
      console.log(response.data)
      setInscriptionsYear(response.data.years)
    } catch (err) {
      console.log("Erreur lors de la récupération des inscriptions par année : ", err);
    }
  }

  useEffect(() => {
    fetchRegister()
    fetchInscriptionsYear()
  }, [])

  const customStyles = {
    headCells: {
      style: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#374151', 
        backgroundColor: '#f9fafb', 
      },
    },
  };

  const filteredInscriptions = inscriptions.filter(ins =>
    ins.nomClient.toLowerCase().includes(filter.toLowerCase()) ||
    ins.service_detail.map(s => s.nom).join(", ").toLowerCase().includes(filter.toLowerCase()) ||
    ins.emailClient.toLowerCase().includes(filter.toLowerCase())
  )

  const handleAdd = async (data) => {
    try {
      await createData("/inscriptions/", data)
      fetchRegister()
      toast.success("Ajout avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de l'ajout : ", err)
      toast.error("Erreur lors de la création de l'inscription", {duration : 3000}) 
    }
  }

  const handleUpdate = async (data) => {
    try {
      await updateData(`/inscriptions/${data.id}/`, data)
      fetchRegister()
      toast.success("Mise à jour avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors du mise à jour : ", err)
      toast.error("Erreur lors du mise à jour de l'inscription", {duration : 3000}) 
    }
  }

  const valider = async (id) => {
    try {
      await updateData(`/inscriptions/${id}/valider/`)
      await getDataPdf(`/inscriptions/${id}/pdf/`, `inscription_${id}.pdf`); 
      fetchRegister()
      toast.success("Validation avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de la validation : ", err);
      toast.error("Erreur lors de la validation de l'inscription", {duration : 3000}) 
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteData(`/inscriptions/${id}/`)
      fetchRegister()
      toast.success("Suppression avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de la suppression : ", err);
      toast.error("Erreur lors de la suppression de l'inscription", {duration : 3000}) 
    }
  }

  const downloadPdf = async () => {
    try {
      const url = selectedYear ? `/inscriptions/pdf_inscription/?year=${selectedYear}` : "/inscriptions/pdf_inscription/"
      await getData(url)
      toast.success("PDF téléchargé avec succès", {duration : 3000})
    } catch(err) {
      console.log("Erreur lors de l'export PDF : ", err)
      toast.error("Erreur lors du téléchargement du pdf", {duration : 3000})
    }
  }

  const columns = [
    { name: "ID", selector: row => row.id, sortable: true, width: "70px" },
    { name: "Nom", selector: row => row.nomClient, sortable: true },
    { name: "Prénoms", selector: row => row.prenomClient, sortable: true },
    { name: "Email", selector: row => row.emailClient, grow: 2 },
    { name: "Téléphone", selector: row => row.telephoneClient },
    { name: "Formation", selector: row => row.service_detail.map(s => s.nom).join(", ")  },
    { name: "Date", selector: row => row.dateInscription },
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
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${bgColor}`}>
            {row.statut}
          </span>
        );
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

          <ModifInscriptionModal value={row} onUpdate={handleUpdate} />
          
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

  return (
    <div className="p-8 bg-white min-h-screen rounded-xl shadow-lg">

      <Toaster position="top-right" reverseOrder={false} />

      {/* --- HEADER --- */}
      <header className="flex items-center gap-3 mb-8 border-b border-indigo-400/30 pb-4">
        <ClipboardList className="h-8 w-8 text-indigo-600" /> 
        <h2 className="font-semibold text-4xl text-gray-800 tracking-wide">
          Partie Inscriptions
        </h2>
      </header>

      {/* --- Barre recherche + select année + PDF --- */}
      <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center mb-6 gap-10">
        <AjoutInscriptionModal onCreate={handleAdd} />

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
            className="h-10 rounded-lg border-gray-300 focus:ring-indigo-500 text-gray-700 px-3"
          >
            <option value="">Sélectionner l'année</option>
            {inscriptionsYear.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <button
          className="
            flex items-center gap-2 
            bg-gray-100 hover:bg-gray-200 
            text-gray-800 
            px-4 py-2 
            cursor-pointer
            rounded-xl 
            shadow-sm 
            transition
          "
          onClick={() => downloadPdf()}
        >
          <span className="text-xl">📄</span>
          <span className="font-medium">PDF à télécharger</span>
          <span className="text-xl">📜</span>
        </button>
      </div>

      {/* --- Tableau --- */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden overflow-x-auto shadow">
        <DataTable
          title={<h3 className='text-xl font-semibold text-gray-700'>Liste des inscriptions en ligne</h3>}
          columns={columns}
          data={filteredInscriptions}
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

export default DashRegister
