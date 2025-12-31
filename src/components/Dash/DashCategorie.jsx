import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash2, Search, Pencil, Image as ImageIcon, Plus, X } from "lucide-react";
import { getData, createFormData, updateDataFormData, deleteData } from "@/service/api";
import AjoutModal from "./Modals/categorie/AjoutModal";
import ModifModal from "./Modals/categorie/ModifModal";
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
import toast, { Toaster } from "react-hot-toast";

export default function DashCategorie() {
  const [categories, setCategories] = useState([]);

  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentCategorie, setCurrentCategorie] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);

  const filteredCategories = categories.filter(c =>
    c.nom.toLowerCase().includes(filterText.toLowerCase())
  );

  //fetch Catégorie

  const fetchCategorie = async () => {
    try {
      const response = await getData("/categories/")
      console.log(response.data)
      setCategories(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération des données concernant les catégories : ", err)
    }
  }

  useEffect(() => {
    fetchCategorie()
  }, [])

  const handleAdd = async (data) => {
    console.log("Depuis dashCategorie : ", data)

    const formData = new FormData()
    formData.append("nom", data.nom);
    formData.append("description", data.description);
    formData.append("button", data.button)

    if(data.image) {
      formData.append("image", data.image)
    }

    try {
      await createFormData("/categories/", formData)
      fetchCategorie()
      toast.success("Ajout avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de l'ajout de la catégorie : ", err)
      toast.error("Erreur lors de la création de la catégorie !!!", {duration : 3000})
    }
  };


  const handleDelete = async (id) => {
   try {
      await deleteData(`/categories/${id}/`)
      fetchCategorie()
      toast.success("Suppression avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de la suppression : ", err)
      toast.error("Erreur lors de la suppression de la catégorie", {duration : 3000})
    }
  };



  const handleSave = async (updatedData) => {
    console.log("Depuis dashCategorie : ", updatedData)

    const formData = new FormData()

    formData.append("nom", updatedData.nom)
    formData.append("description", updatedData.description)
    formData.append("button", updatedData.button)


    if(updatedData.image) {
      formData.append("image", updatedData.image)
    }

    try {
      await updateDataFormData(`/categories/${updatedData.id}/`, formData)
      fetchCategorie()
      toast.success("Modification avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors du mise à jour de la catégorie : ", err)
      toast.error("Erreur lors de la mise à jour de la catégorie !!!", {duration : 3000})
    }

  };


  const columns = [
    { name: "Id", selector: row => row.id, sortable: true },
    {
      name: "Image",
      selector: row => row.image,
      cell: row =>
        row.image ? <img src={row.image} alt={row.nom} className="w-12 h-12 rounded-lg object-cover" />
        : <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            <ImageIcon size={18} />
          </div>,
    },
    { name: "Nom", selector: row => row.nom, sortable: true },
    { name: "Description", selector: row => row.description },
    { name: "Bouton", selector: row => row.button },
    {
      name: "Actions",
      cell: row => (
        <div className="flex gap-2">
          <ModifModal value={row} onUpdate={handleSave} />
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
                <AlertDialogTitle className="text-rose-600">Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Voulez-vous supprimer le projet <b>{row.nom}</b>? Cette action est irréversible.
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
    },
  ];

  const customStyles = {
    headCells: { style: { fontSize: "1.1rem", fontWeight: "700" } },
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-indigo-400/30 pb-4">
        <h2 className="font-bold text-4xl text-gray-800 tracking-wide">
          Gestion des <span className="text-indigo-600">Catégories</span>
        </h2>
      </div>

      {/* Barre recherche + Ajouter */}
      <div className="flex flex-col sm:flex-row-reverse justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input type="text" placeholder="Rechercher par nom..." value={filterText} onChange={e => setFilterText(e.target.value)} className="w-full pl-10 h-10 rounded-lg border-gray-300 focus:ring-indigo-500 text-gray-700" />
        </div>

        <AjoutModal onCreate={handleAdd} />
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
        <DataTable columns={columns} data={filteredCategories} pagination highlightOnHover dense noDataComponent="Aucune catégorie trouvée" customStyles={customStyles} />
      </div>

      {/* Confirmation suppression */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[350px] text-center">
            <h4 className="font-semibold text-lg mb-3 text-gray-800">Supprimer cette catégorie ?</h4>
            <p className="text-sm text-gray-600 mb-5">“{showConfirm.nom}” sera définitivement supprimée.</p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => setShowConfirm(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full px-5">Annuler</Button>
              <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-full px-5">Supprimer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
