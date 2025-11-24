import React from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { UserPlus, Search, Edit, Trash2, Users, Mail } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getData } from '@/service/api';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const equipeSchema = z.object(
    {
        nom : z.string().min(3, "Le nom est trop court."),
        prenom : z.string().min(5, "Le prénom est trop court."),
        email : z.string().email("L'email est invalide."),
        role : z.string().min(5, "Le rôle attribué est trop court."),
        image : z.preprocess(
            (val) => {
                if (val instanceof FileList) return val[0];
                return val;
            },
            z.union([z.string(), z.instanceof(File), z.null()]
            ).optional().refine(
                (value) => {
                    if(!value) return true;
                    if(value instanceof File) {
                        return (
                            value.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(value.type)
                        )
                    }
                    return true;
                },
                {
                    message : "Le fichier ne respecte pas les critères de taille ou de format."
                }
            )
        )
    }
)

const ModifModal = ({ value, onUpdate }) => {
    
    const {
        register,
        handleSubmit,
        reset,
        formState : {errors}
    } = useForm(
        {
            resolver : zodResolver(equipeSchema),
            defaultValues : value
        }
    )

    const [dialogOpen, setDialogOpen] = useState(false)

    const fermerDialog = () => {
        setDialogOpen(false)
        reset(value)
    }

    const submit = (data) => {
        if(data.nom && data.prenom) {
            const dataWithId = {...data, id: value.id}
            onUpdate(dataWithId)
        }

       fermerDialog()
    }


  return (
    <div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg rounded-full h-8 w-8 p-1 transition-all'
                    size="icon"
                    title="Modifier le membre">
                    <Edit className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-700">
                        Modifier ce Membre : 
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(submit)} encType='multipart/form-data'>

                    <div className='grid gap-4 py-4'>
                        {/* Champ Nom de Famille */}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="nom" className="font-medium text-gray-700">
                                Nom de Famille <span className="text-rose-500">*</span>
                            </label>
                            <Input
                                id="nom"
                                {...register("nom")}
                                placeholder="Ex: DUPONT"
                                className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10" 
                            />
                            {errors.nom && <p className='text-red-500 text-[12px]'>{errors.nom.message}</p>}
                        </div>

                        {/* Champ Prénoms */}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="prenom" className="font-medium text-gray-700">
                                Prénoms <span className="text-rose-500">*</span>
                            </label>
                            <Input
                                id="prenom"
                                placeholder="Ex: Jean Martin"
                                {...register('prenom')}
                                className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10" 
                            />
                            {errors.nom && <p className='text-red-500 text-[12px]'>{errors.nom.message}</p>}
                        </div>

                        {/* Champ Rôle */}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="role" className="font-medium text-gray-700">
                                Rôle <span className="text-rose-500">*</span>
                            </label>
                            <Textarea
                                id="role"
                                {...register("role")}
                                placeholder="Ex: Développeur Senior"
                                className="col-span-3 text-gray-800 resize-none border-gray-400"
                                rows={3} 
                            />
                            {errors.role && <p className='text-red-500 text-[12px]'>{errors.role.message}</p>}
                        </div>

                        {/* Champ Email */}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="email" className="font-medium text-gray-700">
                                Email <span className="text-rose-500">*</span>
                            </label>
                            <Input
                                id="email"
                                {...register("email")}
                                placeholder="Ex: email@example.com"
                                className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10" 
                            />
                            {errors.email && <p className='text-red-500 text-[12px]'>{errors.email.message}</p>}
                        </div>
                        
                        {/* Champ URL Photo */}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="image" className="font-medium text-gray-700">
                                Image : 
                            </label>
                            {value.image && (
                                <img
                                    src={value.image}
                                    alt="Image actuelle"
                                    className="w-24 h-24 object-cover mb-2 rounded"
                                />
                            )}
                            <Input
                                type="file"
                                id="image"
                                {...register("image")}
                                placeholder="URL de l'image de profil"
                                className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10" 
                            />
                            {errors.image && <p className='text-red-500 text-[12px]'>{errors.image.message}</p>}
                        </div>

                    </div>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={fermerDialog}
                            className="hover:bg-gray-200 rounded-full text-gray-700"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 rounded-full"
                        >
                           Sauvegarder
                        </Button>
                    </DialogFooter>
                </form>
                
            </DialogContent>
        </Dialog>        
    </div>
  )
}

export default ModifModal