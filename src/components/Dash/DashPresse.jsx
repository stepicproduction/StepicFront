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
import ModifPresseModal from "./Modals/presse/ModifPresseModal";
import AjoutPresseModal from "./Modals/presse/AjoutPresseModal";
import toast, { Toaster } from "react-hot-toast";

const JOURNAUX = ["National", "International"];

export default function DashPresse() {
  const [filterText, setFilterText] = useState("");

  const [presse, setPresse] = useState([]);


  const filteredPresse = presse.filter((p) => {
    const matchText = p.titre.toLowerCase().includes(filterText.toLowerCase()) 
    return matchText ;
  });

  //récupération des données concernant l'actualités
  const fetchPresse = async () => {
    try {
      const response = await getData("/presses/")
      console.log(response.data)
      setPresse(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération des données concernant l'actualités : ", err)
    }
  }

  useEffect(() => {
    fetchPresse()
  }, [])

  const handleAdd = async (data) => {
      console.log("depuis dashPresse : ", data);

      // Créer un FormData pour multipart/form-data
      const formData = new FormData();
      formData.append("titre", data.titre);
      formData.append("contenu", data.contenu);

      if (data.image) {
          formData.append("image", data.image); // ajouter le fichier
        }
        
        try {
          await createFormData("/presses/", formData); // envoyer FormData
          fetchPresse();
          toast.success("Ajout avec succès", {duration : 3000})
      } catch (err) {
          console.log("Erreur lors de la création de la presse : ", err);
          toast.error("Erreur lors de la création de la presse !!!", {duration : 3000})
      }
  };



  const handleDelete = async (id) => {
    try {
      await deleteData(`/presses/${id}/`)
      fetchPresse()
      toast.success("Suppression avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de la suppression de la presse : ", err)
      toast.error("Erreur lors de la suppression de la presse", {duration : 3000})      
    }  
  };


  const handleSave = async (updatedData) => {
    console.log("depuis dashProject",updatedData)
    const formData = new FormData()
    formData.append("titre", updatedData.titre);
    formData.append("contenu", updatedData.contenu);

    if (updatedData.image) {
        formData.append("image", updatedData.image); // ajouter le fichier
    }


    try {
        await updateDataFormData(`/presses/${updatedData.id}/`, formData); // envoyer FormData
        fetchPresse();
        toast.success("Mise à jour avec succès", {duration : 3000})
    } catch (err) {
        console.log("Erreur lors de la création de la presse : ", err);
        toast.error("Erreur lors de la mise à jour de la presse !!!", {duration : 3000})
    }
  };

  const columns = [
    { name: "id", selector: (row) => row.id },
    {
      name: "Image",
      selector: (row) => row.image,
      cell: (row) =>
        row.image ? (
          <img
            src={row.image}
            alt={row.titre}
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            <ImageIcon size={18} />
          </div>
        ),
    },
    { name: "Titre", selector: (row) => row.titre, sortable: true },
    { name: "Type", selector: (row) => row.contenu },
    { name: "Date", selector: (row) => row.date_pub },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <ModifPresseModal value={row} onUpdate={handleSave} />
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

  const customStyles = {
    headCells: {
      style: {
        fontSize: "1.1rem",
        fontWeight: "700",
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
            Journaux & Presse{" "}
            <span className="text-indigo-600">Madagascar</span>
          </h2>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row-reverse justify-between items-center mb-6 gap-4 bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
        <div className="relative w-full lg:w-96">
          <Input
            type="text"
            placeholder="Rechercher par titre ou source..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-10 shadow-inner"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <AjoutPresseModal onCreate={handleAdd} />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <DataTable
          columns={columns}
          data={filteredPresse}
          pagination
          highlightOnHover
          dense
          noDataComponent="Aucun article trouvé"
          customStyles={customStyles}
        />
      </div>
    </div>
  );
}
