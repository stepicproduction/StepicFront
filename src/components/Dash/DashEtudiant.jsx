import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Input } from '../ui/input';
import { Search, CircleX, Trash2, HandPlatter, Download, LoaderCircle as Loader, Check  } from "lucide-react"; 
import { Button } from '../ui/button';
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
import { getData, createData, updateData, deleteData, getDataPdf } from "@/service/api";
import AjoutEtudiant from "../Dash/Modals/etudiant/AjoutEtudiant";
import ModifEtudiant from "../Dash/Modals/etudiant/ModifEtudiant";
import { motion, AnimatePresence } from 'framer-motion';


const DownloadQRButton = ({ studentId, studentMatricule }) => {
    const [status, setStatus] = useState('idle'); // idle | loading | success | error

    const handleDownload = async () => {
        try {
            setStatus('loading');
            // Utilise ton helper qui gère les Blobs (celui qu'on a vu pour les PDF)
            // On l'appelle ici pour le QR Code
            await getDataPdf(`etudiants/${studentId}/download_qr/`, `${studentMatricule}_QR_Code.png`);
            

            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000); // Revient à l'icône normale après 3s
        } catch (error) {
            console.error(error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <Button
            onClick={handleDownload}
            disabled={status === 'loading'}
            className={`h-8 w-8 p-1 rounded-full transition-all shadow-md cursor-pointer ${
                status === 'success' ? 'bg-green-500 hover:bg-green-600' : 
                status === 'error' ? 'bg-red-500 hover:bg-red-600' : 
                'bg-indigo-600 hover:bg-indigo-700'
            } text-white`}
            size="icon"
            title="Télécharger le badge QR"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={status}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                >
                    {status === 'idle' && <Download className="h-4 w-4" />}
                    {status === 'loading' && <Loader className="h-4 w-4 animate-spin" />}
                    {status === 'success' && <Check className="h-4 w-4" />}
                    {status === 'error' && <CircleX className="h-4 w-4" />}
                </motion.div>
            </AnimatePresence>
        </Button>
    );
};


const DashEtudiant = () => {

    const [etudiant, setEtudiant] = useState([]);
    const [filter, setFilter] = useState("");

    const fetchEtudiants = async () => {
        try {
            const response = await getData('etudiants/');
            console.log("Info Etudiant :", response.data)
            setEtudiant(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des étudiants :", error);
        }
    };

    useEffect(() => {
        fetchEtudiants();
    }, []);

    const handleCreate = async (data) => {
        try {
            console.log(data)
            await createData('etudiants/', data);
            fetchEtudiants();
            toast.success("Ajout avec succès", {duration : 3000})
        } catch (error) {
            console.error("Erreur lors de la création de l'étudiant :", error);
            toast.error("Erreur lors de l'ajout !!!", {duration : 3000})
        }
    };

    const handleUpdate = async (updatedData) => {
        try {
            console.log("Données mises à jour :", updatedData)
            await updateData(`etudiants/${updatedData.id}/`, updatedData);
            fetchEtudiants();
            toast.success("Modification avec succès", {duration : 3000})
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'étudiant :", error);
            toast.error("Erreur lors de la mise à jour !!!", {duration : 3000})
        }   
    };

    const handleDelete = async (id) => {
        try {
            await deleteData(`etudiants/${id}/`);
            fetchEtudiants();
            toast.success("Suppression avec succès", {duration : 3000})
        } catch (error) {
            console.error("Erreur lors de la suppression de l'étudiant :", error);
            toast.error("Erreur lors de la suppression !!!", {duration : 3000})
        }
    };


  const colonnes = [
    {
      name :"Matricule", selector : row => row.matricule, sortable : true
    },
    {
      name :"Nom et Prénom(s)", selector : row => row.nom, sortable : true
    },
    {
      name :"Prénom(s)", selector : row => row.prenom, sortable : true,
    },
    {
      name :"Parcours", selector : row => row.formations.map(f => f.nom).join(', '), sortable : true,
    },
    {
      name: "Actions", cell: (row) => (
        <div className='flex gap-2'>
           <DownloadQRButton studentId={row.id} studentMatricule={row.matricule} /> 
          {/* <ModifEtudiant value={row} onUpdate={handleUpdate}/>
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
                  Voulez-vous supprimer l'information de l'Etudiant(e) <b>{row.nom && row.prenom}</b>? Cette action est irréversible.
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
          </AlertDialog> */}
        </div>
      ),
    },    
  ]   
  
  const filterStudent = etudiant.filter((e) => e.nom && e.nom.toLowerCase().includes(filter.toLocaleLowerCase()) ||
    e.prenom && e.prenom.toLowerCase().includes(filter.toLocaleLowerCase()) ||
    e.matricule && e.matricule.toLowerCase().includes(filter.toLocaleLowerCase())
  );


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
    <div>

      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex flex-col lg:flex-row-reverse justify-between items-center mb-6 gap-4 bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
        <div  className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input type="text" placeholder="Chercher par nom ou prénom(s)..." onChange = {(e) => setFilter(e.target.value)} 
            className="w-full pl-10 h-10 rounded-lg border-gray-300 focus:ring-indigo-500 text-gray-700"/>
        </div>
        {/* <AjoutEtudiant onCreate={handleCreate} /> */}
      </div>
      <div className='w-full'>
        <DataTable title = "Liste des étudiants :"
            columns={colonnes} 
            data={filterStudent} 
            pagination
            highlightOnHover
            dense
            noDataComponent="Aucun article trouvé"
            customStyles={customStyles}
        />
      </div>
    </div>
  )
}

export default DashEtudiant