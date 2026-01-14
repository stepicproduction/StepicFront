import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import { Input } from "../ui/input";
import { Search, UserCog } from "lucide-react"; 
import toast, { Toaster } from "react-hot-toast";
import { getData, createFormData, deleteData, updateDataFormData } from "@/service/api";

// NOUVEAUX IMPORTS (les deux modaux séparés)
import AjoutUserModal from "./Modals/user/AjoutUserModal";
// ModifierUserModal n'est plus importé ici, il est importé dans UserTableColumns
import { getUserColumns, customTableStyles } from "./Modals/user/UserTableColumns";


const initialFormState = { nom: "", prenoms: "", role: "Employé", email: "" };

export default function DashUser() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  // CHANGEMENT: Nous gardons dialogOpen et form pour le modal d'AJOUT uniquement
  const [form, setForm] = useState(initialFormState);

  // --- LOGIQUE DE L'API & CRUD ---
  
  const fetchUsers = async () => { /* ... (inchangé) */
    try {
      const response = await getData("/utilisateurs/");
      console.log(response.data);
      
      setUsers(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des données utilisateurs : ", err);
    }
  };



  // 💾 Fonction de Création (utilisée par AjoutUserModal)
  const handleCreate = async (data) => {
    console.log(data)

    const formData = new FormData()

    formData.append("username", data.username)
    formData.append("role", data.role)
    formData.append("password", data.password)
    formData.append("email", data.email)

    if(data.image) {
      formData.append("image", data.image)
    }
    
    try {
      await createFormData("/utilisateurs/", formData)
      fetchUsers()
      toast.success("Création avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de l'Ajout d'utilisateur : ", err)
      toast.error("Erreur lors de la création d'utilisateur", {duration : 3000})
    }

  };
  
  // ✏️ Fonction de Mise à Jour (utilisée par ModifierUserModal)
  const handleUpdate = async (updatedUserData) => {
    console.log("mise à jour depuis dashUser : ", updatedUserData)

    const formData = new FormData()

    formData.append("username", updatedUserData.username)
    formData.append("role", updatedUserData.role)
    formData.append("email", updatedUserData.email)

    if(updatedUserData.password) {
      formData.append("password", updatedUserData.password)
    }

    if(updatedUserData.image instanceof File) {
      formData.append("image", updatedUserData.image)
    }

    try {
      await updateDataFormData(`/utilisateurs/${updatedUserData.id}/`, formData)
      fetchUsers()
      toast.success("Mise à jour avec succès", {duration : 3000})
    } catch (err) {
      console.log("erreur", err);
      toast.error("Erreur lors de la mise à jour d'utilisateur", {duration : 3000})
    }
  };

  // 🗑️ Fonction de Suppression (utilisée par UserTableColumns)
  const handleDelete = async (id) => {
    try {
      await deleteData(`/utilisateurs/${id}/`)
      fetchUsers()
      toast.success("Suppression avec succès", {duration : 3000})
    } catch (err) {
      console.log("Erreur lors de la suppression de l'utilisateur : ", err)
      toast.error("Erreur lors de la suppression d'utilisateur", {duration : 3000})
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- FILTRAGE ET COLONNES ---
  
  // 🔍 Filtrage
  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      Object.values(u).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [users, filter]);

  // 📋 Colonnes du tableau (passant les fonctions de CRUD au composant)
  // ATTENTION: On passe handleUpdate et handleDelete car c'est la logique finale des actions
  const columns = useMemo(() => getUserColumns(handleUpdate, handleDelete), [handleUpdate, handleDelete]);

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

  // --- RENDU PRINCIPAL ---
  return (
    <div className="p-8 bg-white min-h-screen rounded-xl shadow-lg">


      <Toaster position="top-right" reverseOrder={false} />

      {/* --- HEADER --- */}
      <header className="flex items-center gap-3 mb-8 border-b border-indigo-400/30 pb-4">
        <UserCog className="h-8 w-8 text-indigo-600" />
        <h2 className="font-semibold text-4xl text-gray-800 tracking-wide">
          Gestion des Utilisateurs
        </h2>
      </header>

      {/* --- Barre de recherche + bouton Ajouter --- */}
      <div className="flex flex-col sm:flex-row-reverse justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 h-10 rounded-lg border-gray-300 focus:ring-indigo-500 text-gray-700"
          />
        </div>

        {/* MODAL D'AJOUT (déclenche le dialogue d'ajout) */}
        <AjoutUserModal onCreate={handleCreate} />
      </div>

      {/* --- Tableau --- */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow">
        <DataTable
          columns={columns}
          data={filteredUsers}
          pagination
          highlightOnHover
          striped
          responsive
          className="rounded-xl"
          customStyles={customTableStyles} 
        />
      </div>
    </div>
  );
}