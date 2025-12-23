import React from 'react'
import { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { 
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
 } from '../ui/alert-dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

import { getData, createData, deleteData, updateData } from '@/service/api'
import { Trash2, Search } from 'lucide-react'
import AjoutCommandeModal from './Modals/about/AjoutAboutModal'
import ModifierCommandeModal from './Modals/about/ModifierAboutModal'
import toast, { Toaster } from "react-hot-toast";



function DashAbout() {

  const [about, setAbout] = useState([])
  const [filter, setFilter] = useState("")

  const fetchData = async() => {
    try {
      const response = await getData("/about")
      console.log(response.data)
      setAbout(response.data)
    } catch (err) {
      console.log("erreur :", err);
    }
  } 

  const colonnes = [
    {
      name :"ID", selector : row => row.id, sortable : true
    },
    {
      name :"Titre", selector : row => row.titre, sortable : true
    },
    {
      name :"Contenu", selector : row => row.contenu, sortable : true,
       cell: (row) => (
        <div style={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }} >
          {row.contenu.substring(0, 150)}{row.contenu.length > 150 ? "..." : ""}
        </div>
      )
    },
    {
      name: "Actions", cell: (row) => (
        <div className='flex gap-2'>
          <ModifierCommandeModal value={row} onUpdate={handleUpdate}/>
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
            <AlertDialogContent className="bg-white text-gray-400">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-rose-600">Confirmer la suppression </AlertDialogTitle>
                <AlertDialogDescription>
                  Voulez-vous supprimer l'à propos au sujet de <b>{row.titre}</b>? Cette action est irréversible.
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
                <AlertDialogAction onClick={() => handleDelete(row.id)}
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
    },    
  ]

  const handleCreate = async (about) => {
    try {
      await createData('/about/', about)
      fetchData()
      toast.success("Ajout avec succès", {duration : 3000})
    } catch (err) {
      console.log("erreur", err);
      toast.error("Erreur lors de la création !!!", {duration : 3000})
    }
  }

  const handleUpdate = async (updatedData) => {
    try {
      console.log(updatedData)
      await updateData(`/about/${updatedData.id}/`, updatedData)
      toast.success("Modification avec succès", {duration : 3000})
      fetchData()
    } catch (err) {
      console.log("erreur", err);
      toast.error("Erreur lors de la mise à jour !!!", {duration : 3000})
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteData(`/about/${id}/`)
      fetchData()
      toast.success("Suppression avec succès", {duration : 3000})
    } catch(err) {
      console.log("erreur", err);
      toast.error("Erreur lors de la suppression du service", {duration : 3000})
      
    }
  }

 const filterAbout = about.filter((a) => a.titre && a.titre.toLowerCase().includes(filter.toLocaleLowerCase()));

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>

      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex flex-col lg:flex-row-reverse justify-between items-center mb-6 gap-4 bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
        <div  className="relative w-full lg:w-96">
          <Input type="text" placeholder="Chercher..." onChange = {(e) => setFilter(e.target.value)} 
            className="pl-10 shadow-inner"/>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <AjoutCommandeModal onCreate={handleCreate} />
      </div>
      <div className='w-full'>
        <DataTable title = "Liste des à propos :"
        columns={colonnes} data={filterAbout} selectableRows responsive pagination highlightOnHover pointerOnHover stripe/>
      </div>
    </div>
  )
}

export default DashAbout