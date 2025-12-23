import React, { useState,useEffect } from "react";
import DataTable from "react-data-table-component";
import { Trash2, Search, Briefcase,  Image } from "lucide-react"; 
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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
import AjoutProjetModal from "./Modals/projet/AjoutProjetModal";
import ModifierProjetModal from "./Modals/projet/ModifierProjetModal";

// URL d'image de substitution en cas d'erreur de chargement
const PLACEHOLDER_IMG = "https://placehold.co/50x50/3b82f6/ffffff?text=IMG";

function DashProject() {
  const [projects, setProjects] = useState([]);

  const [filter, setFilter] = useState("");

  // --- Styles personnalisés pour les en-têtes de tableau (DataTable) ---
  const customStyles = {
    headCells: {
      style: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#374151',
        backgroundColor: '#f9fafb',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
      },
    }
  };

  // --- Logique CRUD ---

  const fetchProject = async () => {
    try {
      const response = await getData("/projets/")
      console.log(response.data)
      setProjects(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération des données concernant les projets : ", err)
    }
  }

  useEffect(() => {
    fetchProject()
  }, [])

  const handleCreate = async (data) => {
      console.log("depuis dashProject : ", data);

      // Créer un FormData pour multipart/form-data
      const formData = new FormData();
      formData.append("titre_projet", data.titre_projet);
      formData.append("description_projet", data.description_projet);

      if (data.image) {
          formData.append("image", data.image); // ajouter le fichier
      }

      if (data.service) {
          formData.append("service", data.service); // si tu as le service
      }

      try {
          await createFormData("/projets/", formData); // envoyer FormData
          fetchProject();
          toast.success("Ajout avec succès", {duration : 3000})
      } catch (err) {
          console.log("Erreur lors de la création du projet : ", err);
          toast.error("Erreur lors de la création du projet !!!", {duration : 3000})
      }
  };

  const handleSaveEdit = async (updatedData) => {
    console.log("depuis dashProject",updatedData)
    const formData = new FormData()
    formData.append("titre_projet", updatedData.titre_projet);
    formData.append("description_projet", updatedData.description_projet);

    if (updatedData.image) {
        formData.append("image", updatedData.image); // ajouter le fichier
    }

    if (updatedData.service) {
        formData.append("service", updatedData.service); // si tu as le service
    }

    try {
        await updateDataFormData(`/projets/${updatedData.id}/`, formData); // envoyer FormData
        fetchProject();
        toast.success("Mise à jour avec succès", {duration : 3000})
    } catch (err) {
        console.log("Erreur lors de la création du projet : ", err);
        toast.error("Erreur lors de la mise à jour du projet !!!", {duration : 3000})
    }
  };

  
  const handleDelete = async (id) => {
    try {
      await deleteData(`/projets/${id}/`)
      fetchProject()
      toast.success("Suppression avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de la suppression du projet : ", err)
      toast.error("Erreur lors de la suppression du projet", {duration : 3000}) 
    }
  };
  
  // Filtrage
  const filteredProjects = projects.filter((p) =>
    Object.values(p).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(filter.toLowerCase())
    )
  );

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
                    e.target.src = PLACEHOLDER_IMG;
                }}
            />
        ),
        width: "70px",
        ignoreRowClick: true,
    },
    {
      name: "Titre",
      selector: (row) => row.titre_projet,
      sortable: true,
      grow: 1.5,
      // Texte principal du projet
      cell: (row) => (
        <span className="font-medium text-gray-800">{row.titre_projet}</span>
      )
    },
    {
      name: "Description",
      selector: (row) => row.description_projet,
      sortable: false,
      grow: 2.5,
      // Afficher un aperçu de la description
      cell: (row) => (
        <span className="text-gray-600 truncate max-w-xs">{row.description_projet}</span>
      )
    },
    {
      name: "Actions",
      width: "100px",
      cell: (row) => (
        <div className="flex gap-2">
          <ModifierProjetModal value={row} onUpdate={handleSaveEdit} />          
          {/* Bouton de Suppression */}
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
                  Voulez-vous supprimer le projet <b>{row.title}</b>? Cette action est irréversible.
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

  return (
    <div className="p-8 bg-white min-h-screen rounded-xl shadow-lg">

      <Toaster position="top-right" reverseOrder={false} />
      
      {/* --- HEADER --- */}
      <header className="flex items-center gap-3 mb-8 border-b border-blue-400/30 pb-4">
        <Briefcase className="h-8 w-8 text-blue-600" /> 
        <h2 className="font-semibold text-4xl text-gray-800 tracking-wide">
          Gestion des Projets
        </h2>
      </header>

      {/* --- Barre recherche & Bouton Nouveau --- */}
      <div className="flex justify-between items-center mb-6">
        <AjoutProjetModal onCreate={handleCreate} />
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un projet..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 h-10 rounded-lg border-gray-300 focus:ring-blue-500 text-gray-700"
          />
        </div>
      </div>

      {/* --- Tableau --- */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow">
        <DataTable
          title={<h3 className='text-xl font-semibold text-gray-700'>Liste des projets</h3>}
          columns={columns}
          data={filteredProjects}
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

export default DashProject;
