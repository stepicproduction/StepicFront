import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Search,
  FileText,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
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
import AjoutActuModal from "./Modals/actu/AjoutActuModal";
import ModifActuModal from "./Modals/actu/ModifActuModal";
import toast, { Toaster } from "react-hot-toast";


export default function DashActu() {
  const [filterText, setFilterText] = useState("");

  const [articles, setArticles] = useState([]);



  const filteredArticles = articles.filter((a) => {
    const matchText =
      a.titreActu.toLowerCase().includes(filterText.toLowerCase()) ||
      a.contenuActu.toLowerCase().includes(filterText.toLowerCase());
    return matchText
  });

  //récupération des données concernant l'actualités
  const fetchActu = async () => {
    try {
      const response = await getData("/actualites/")
      console.log(response.data)
      setArticles(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération des données concernant l'actualités : ", err)
    }
  }

  useEffect(() => {
    fetchActu()
  }, [])

  const handleAdd = async (data) => {
      console.log("depuis dashActu : ", data);

      // Créer un FormData pour multipart/form-data
      const formData = new FormData();
      formData.append("titreActu", data.titreActu);
      formData.append("contenuActu", data.contenuActu);

      if (data.imageActu) {
          formData.append("imageActu", data.imageActu); // ajouter le fichier
      }

      try {
          await createFormData("/actualites/", formData); // envoyer FormData
          fetchActu();
          toast.success("Ajout avec succès", {duration : 3000})
      } catch (err) {
          console.log("Erreur lors de la création de l'actualité : ", err);
          toast.error("Erreur lors de la création de l'actualité !!!", {duration : 3000})
      }
  };



  const handleDelete = async (id) => {
    try {
      await deleteData(`/actualites/${id}/`)
      fetchActu()
      toast.success("Suppression avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de la suppression de l'actualité : ", err)
      toast.error("Erreur lors de la suppression de l'actualité", {duration : 3000})
    }  
  };


  const handleSave = async (updatedData) => {
    console.log("depuis dashProject",updatedData)
    const formData = new FormData()
    formData.append("titreActu", updatedData.titreActu);
    formData.append("contenuActu", updatedData.contenuActu);

    if (updatedData.imageActu) {
        formData.append("imageActu", updatedData.imageActu); // ajouter le fichier
    }


    try {
        await updateDataFormData(`/actualites/${updatedData.id}/`, formData); // envoyer FormData
        fetchActu();
        toast.success("Modification avec succès", {duration : 3000})
    } catch (err) {
        console.log("Erreur lors de la mise à jour de l'actualité : ", err);
        toast.error("Erreur lors de la mise à jour de l'actualité !!!", {duration : 3000})
    }
  };

  const columns = [
    { name: "id", selector: (row) => row.id, sortable: true },
    {
      name: "Image",
      selector: (row) => row.imageActu,
      cell: (row) =>
        row.imageActu ? (
          <img
            src={row.imageActu}
            alt={row.titreActu}
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            <ImageIcon size={18} />
          </div>
        ),
    },
    { name: "Titre", selector: (row) => row.titreActu, sortable: true },
    { name: "Contenu", selector: (row) => row.contenuActu },
    { name: "Date", selector: (row) => row.datePub },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <ModifActuModal value={row} onUpdate={handleSave} />
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
                  Voulez-vous supprimer le projet <b>{row.titreActu}</b>? Cette action est irréversible.
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

  // Styles personnalisés pour agrandir et mettre en gras l'entête
  const customStyles = {
    headCells: {
      style: {
        fontSize: "1.1rem", // un peu plus grand
        fontWeight: "700",   // gras
      },
    },
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex items-center justify-between mb-8 border-b border-indigo-400/30 pb-4">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-indigo-600" />
          <h2 className="font-bold text-4xl text-gray-800 tracking-wide">
            Actualités de l’entreprise{" "}
            <span className="text-indigo-600">STEPIC</span>
          </h2>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row-reverse justify-between items-center mb-6 gap-4 bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
        <div className="relative w-full lg:w-96">
          <Input
            type="text"
            placeholder="Rechercher par titre..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-10 shadow-inner"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>


        <AjoutActuModal onCreate={handleAdd} />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <DataTable
          columns={columns}
          data={filteredArticles}
          pagination
          highlightOnHover
          dense
          noDataComponent="Aucune actualité trouvée"
          customStyles={customStyles} // <-- ajout ici
        />
      </div>

    </div>
  );
}
