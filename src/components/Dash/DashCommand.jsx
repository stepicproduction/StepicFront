import React, { useState, useEffect, useRef } from 'react'
import DataTable from 'react-data-table-component'
import { Input } from '../ui/input'
// On importe les composants de Lucide (Search, Check, X)
import { Search, Check, Trash2, Handbag } from 'lucide-react' 
import { Button } from '../ui/button'
import toast, { Toaster } from "react-hot-toast";
import { getData, updateData, createData,  deleteData } from '@/service/api'
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

function DashCommand() {
  // --- Données initiales ---

  const [commandes, setCommandes] = useState([])
  const [filter, setFilter] = useState("")
  //const socketRef = useRef(null)

  //Récupération des données des commandes
  const fetchCommande = async () => {
    try {
      const response = await getData("/commandes/")
      console.log(response.data);
      setCommandes(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération des données concernant les commandes : ", err);
    }
  }

  useEffect(() => {
    fetchCommande()
  }, [])

  const handleAdd = async (data) => {
    console.log("Ajout depuis dashCommande : ", data)
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
    console.log("Modification depuis dashCommande : ", data)
    try {
      await updateData(`/commandes/${data.id}/`, data)
      fetchCommande()
      toast.success("Modification avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors du mise à jour : ", err)
      toast.error("Erreur lors de la mise à jour de la commande !!!", {duration : 3000})
    }
  }
  // --- Styles personnalisés pour les en-têtes de tableau (DataTable) ---
  const customStyles = {
    headCells: {
      style: {
        fontSize: '15px', // Taille légèrement plus grande
        fontWeight: '700', // Gras
        color: '#374151', 
        backgroundColor: '#f9fafb', 
      },
    },
  };

  // Filtrage
  const filteredInscriptions = commandes.filter(comm =>
    comm.nomClient.toLowerCase().includes(filter.toLowerCase()) ||
    comm.prenomClient.toLowerCase().includes(filter.toLowerCase()) ||
    comm.service_detail.map(s => s.nom).join(", ").toLowerCase().includes(filter.toLowerCase()) ||
    comm.emailClient.toLowerCase().includes(filter.toLowerCase())
  )

  const valider = async (id) => {
    try {
      await updateData(`/commandes/${id}/valider/`)
      fetchCommande()
      toast.success("Commande validée et envoye e-mail avec succès", {duration : 3000})
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

  // Colonnes tableau
  const columns = [
    { name: "ID", selector: row => row.id, sortable: true, width: "70px" },
    { name: "Nom", selector: row => row.nomClient, sortable: true },
    { name: "Prénoms", selector: row => row.prenomClient, sortable: true },
    { name: "Email", selector: row => row.emailClient, grow: 2 },
    { name: "Téléphone", selector: row => row.telephone },
    { name: "Catégorie", selector: row => row.categorie_detail ? row.categorie_detail.nom : "-", sortable: true },
    { name: "Service", selector: row => row.service_detail.map(s => s.nom).join(", ")
      
     },
    { name: "Date", selector: row => row.dateCommande },
    {
      name: "Statut",
      selector: row => row.statut,
      width: "120px",
      cell: row => {
        let bgColor;
        switch(row.statut) {
          case "Validé":
            bgColor = "bg-green-500";
            break;
          case "Rejeté":
            bgColor = "bg-rose-500";
            break;
          default:
            bgColor = "bg-amber-500"; // En attente
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
          {/* Bouton de Validation (Vert, Cercle) */}
          <Button
            onClick={() => valider(row.id)}
            className="bg-green-500 hover:bg-green-600 text-white shadow-lg rounded-full h-8 w-8 p-1 transition-all"
            size="icon"
            disabled={row.statut !== "En attente"} // Désactiver si déjà traité
          >
            <Check className="h-4 w-4" />
          </Button>

          <ModifCommandeModal value={row} onUpdate={handleSave} />
          
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
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle className="text-rose-600">Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                          Voulez-vous supprimer le membre <b>{row.nomClient} {row.prenomClient}</b>? Cette action est irréversible.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel asChild>
                          <Button variant="secondary" className="rounded-full text-gray-700 hover:bg-gray-200">Annuler</Button>
                      </AlertDialogCancel>
                      <AlertDialogAction 
                          onClick={() => handleDelete(row.id)}
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
        <Handbag className="h-8 w-8 text-indigo-600" /> 
        <h2 className="font-semibold text-4xl text-gray-800 tracking-wide">
          Partie Commandes
        </h2>
      </header>

      {/* --- Barre recherche --- */}
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
      </div>

      {/* --- Tableau --- */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow">
        <DataTable
          title={<h3 className='text-xl font-semibold text-gray-700'>Liste des commandes en ligne</h3>}
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

export default DashCommand
