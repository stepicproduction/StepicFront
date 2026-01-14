import React, { useState, useEffect } from 'react'
import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button';
import { UserPlus } from "lucide-react"; 
import { Input } from '@/components/ui/input';
import { getData } from '@/service/api';

const etudiantSchema = z.object(
    {
        nom : z.string().min(2, "Le nom est trop court."),
        prenom : z.string().min(2, "Le prénom est trop court."),
        matricule : z.string().min(2, "Le matricule est trop court."),
        parcours : z.string().min(2, "Le nom du parcours est trop court."),
    }
);

const AjoutEtudiant = ({ onCreate }) => {

    const [dialogOpen, setDialogOpen] = useState(false)
    const [formations, setFormations] = useState([])

    const {
            register,
            handleSubmit,
            reset,
            formState : {errors}
        } = useForm(
            {
                resolver : zodResolver(etudiantSchema)
            }
    )

    const fetchFormations = async () => {
        try {
            const response =  await getData('services/with_inscription/')
            setFormations(response.data)
        } catch (error) {
            console.error("Erreur lors de la récupération des formations :", error)
        }
    }

    useEffect(() => {
        fetchFormations()
    }, [])

    const submit = (data) => {
        if(data.nom && data.prenom && data.matricule && data.parcours) {
            onCreate(data)
            console.log("Envoyé")
        }

        reset({
            nom : '',
            prenom : '',
            matricule : '',
            parcours : ''
        })

        setDialogOpen(false)
    }    

  return (
    <div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button
                //onClick={() => onOpenChange(true)} // Pour ouvrir via le bouton "Ajouter"
                className="flex gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-md rounded-full px-5 h-10 transition-all"
                >
                <UserPlus size={18} />
                Ajouter
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10 bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-indigo-700">
                    Ajouter un Etudiant
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(submit)} encType="multipart/form-data">
                    <div className='grid gap-4 py-4'>
                        {/* Champ Matricule */}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="matricule" className="font-medium text-gray-700">
                                N°Matricule de l'étudiant : 
                            </label>
                            <Input
                                {...register("matricule")}
                                // Assurer la visibilité du texte
                                className="col-span-3 text-gray-800 border-gray-400 rounded-lg h-10" 
                            />
                            {errors.matricule && <p className='text-red-500 text-[12px]'>{errors.matricule.message}</p>}
                        </div>

                        {/* Champ Nom */}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="nom" className="font-medium text-gray-700">
                                Nom de l'étudiant : 
                            </label>
                            <Input
                                {...register("nom")}
                                // Assurer la visibilité du texte
                                className="col-span-3 text-gray-800 border-gray-400 rounded-lg h-10" 
                            />
                            {errors.nom && <p className='text-red-500 text-[12px]'>{errors.nom.message}</p>}
                        </div>

                        {/* champ Prénom */}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="prenom" className="font-medium text-gray-700">
                                Prénom(s) de l'étudiant : 
                            </label>
                            <Input
                                id="prenom"
                                name="prenom"
                                {...register("prenom")}
                                // Assurer la visibilité du texte
                                className="col-span-3 resize-none text-gray-800 border-gray-400 rounded-lg h-10"
                                rows={4}
                            />
                            {errors.prenom && <p className='text-red-500 text-[12px]'>{errors.prenom.message}</p>}
                        </div>

                        

                        {/* Parcours (Rendu modifiable) */}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="parcours" className="font-medium text-gray-700">
                                Parcours : 
                            </label>
                            <select name="" id="" className='flex w-full items-center justify-between    rounded-md border  bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-800 border-gray-400 h-10' {...register("parcours")}>
                                {formations && formations.map((formation) => (
                                    <option key={formation.id} value={formation.id}>{formation.nom}</option>
                                ))}
                            </select>
                            {errors.parcours && <p className='text-red-500 text-[12px]'>{errors.parcours.message}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                        variant="secondary"
                        onClick={() => setDialogOpen(false)}
                        className="hover:bg-gray-200 rounded-full text-gray-700"
                        >
                        Annuler
                        </Button>
                        <Button type="submit"
                        className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-600 hover:to-cyan-600 rounded-full"
                        >
                        Ajouter
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
      </Dialog>
    </div>
  )
}

export default AjoutEtudiant