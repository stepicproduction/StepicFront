import React from 'react';
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
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
} from "@/components/ui/alert-dialog";
import ModifierUserModal from './ModifierUserModal'; // Import du nouveau modal de modification


/**
 * Définit la configuration des colonnes pour le DataTable des utilisateurs.
 * @param {function} handleUpdate - Fonction pour mettre à jour un utilisateur (sera passée au modal).
 * @param {function} handleDelete - Fonction pour supprimer un utilisateur.
 * @returns {Array<object>} Configuration des colonnes.
 */
export const getUserColumns = (handleUpdate, handleDelete) => [
  { name: "ID", selector: (row) => row.id, width: "80px" },
  {
    name: "Image",
    cell: (row) => (
        <img 
            src={row.image} 
            alt={`${row.username} ${row.password}`} 
            className='h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm'
            onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/150x150/cccccc/000000?text=U"; 
            }}
        />
    ),
    width: "80px",
    ignoreRowClick: true,
  },
  { name: "Nom", selector: (row) => row.username, sortable: true },
  { name: "Email", selector: (row) => row.email, grow: 2 },
  { name: "Rôle", selector: (row) => row.role == "admin" ? "Admin" : "Employé", sortable: true },
  {
    name: "Actions",
    cell: (row) => (
      <div className="flex gap-2">
        {/* MODAL DE MODIFICATION (bouton et logique sont dans le composant) */}
        {/* On passe l'objet 'row' comme 'user' et 'handleUpdate' comme 'onUpdate' */}
        <ModifierUserModal value={row} onUpdate={handleUpdate} />

        {/* Alert Dialog de suppression (inchangé) */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg rounded-full h-8 w-8 p-1 transition-all"
              size="icon"
            >
              <MdDelete className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white text-gray-400">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-rose-600">
                Confirmer la suppression
              </AlertDialogTitle>
              <AlertDialogDescription>
                Supprimer <b>{row.nom || row.username} {row.prenoms}</b> ? Cette action est irréversible.
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
                Supprimer
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

export const customTableStyles = {
    headCells: {
        style: {
            fontSize: '15px',
            fontWeight: '700',
            color: '#374151',
            backgroundColor: '#f9fafb',
        },
    },
};