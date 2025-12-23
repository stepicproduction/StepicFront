import React, { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus } from "lucide-react"; 
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const projetSchema = z.object(
    {
        titre_projet : z.string().min(5, "Le titre est trop court."),
        description_projet : z.string().min(15, "La description est trop courte."),
        image: z.preprocess(
                (val) => {
                     if (val instanceof FileList) return val[0]; // ✅ prendre le premier fichier
                    return val;
                 },
            z
            .union([z.string(), z.instanceof(File), z.null()])
            .optional()
            .refine(
            (value) => {
                if (!value) return true;
                if (value instanceof File) {
                return (
                    value.size <= MAX_FILE_SIZE &&
                    ACCEPTED_IMAGE_TYPES.includes(value.type)
                );
                }
                return true;
            },
            { message: "Le fichier ne respecte pas les critères de taille ou de format." }
            )
        ),

    }
);


const AjoutProjetModal = ({ onCreate }) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState : {errors}
    } = useForm({
        resolver : zodResolver(projetSchema)
    })

    const submit = (data) => {
        if(data.titre_projet && data.description_projet) {
            onCreate(data)
        }
        reset({
            titre_projet : '',
            description_projet : '',
            image : ''
        })

        console.log("envoyé")

        setDialogOpen(false)
    }

  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
            <Button 
            //onClick={openNewDialog}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition shadow-lg w-[200px]"
            >
                <Plus size={20} /> Nouveau Projet
            </Button>
        </DialogTrigger >
        <DialogContent className="sm:max-w-[500px] [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10 bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-700">
              Créer un nouveau projet
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(submit)} encType="multipart/form-data">

            <div className='grid gap-4 py-4'>
                {/* Champ Titre Projet */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="titre_projet" className="font-medium text-gray-700">
                        Titre Projet :  <span className="text-rose-500">*</span>
                    </label>
                    <Input
                        id="titre_projet"
                        {...register("titre_projet")}
                        className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10" 
                    />
                    {errors.titre_projet && <p className='text-red-500 text-[12px]'>{errors.titre_projet.message}</p>}
                </div>

                {/* Champ Description Projet */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="description_projet" className="font-medium text-gray-700">
                        Description Projet : <span className="text-rose-500">*</span>
                    </label>
                    <Textarea
                        id="description_projet"
                        {...register("description_projet")}
                        className="col-span-3 text-gray-800 resize-none border-gray-400"
                        rows={3} 
                    />
                    {errors.description_projet && <p className='text-red-500 text-[12px]'>{errors.description_projet.message}</p>}
                </div>

                {/* Champ Image URL */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="image" className="font-medium text-gray-700">
                        Image : <span className="text-rose-500">*</span>
                    </label>
                    <Input
                        type="file"               
                        id="image"
                        accept={ACCEPTED_IMAGE_TYPES.join(', ')}
                        {...register("image")}
                        className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10"
                    />
                    {errors.image && <p className='text-red-500 text-[12px]'>{errors.image.message}</p>}
                </div>
            </div>

            <DialogFooter>
                <Button
                variant="secondary"
                onClick={() => {
                    setDialogOpen(false);
                }}
                className="hover:bg-gray-200 rounded-full text-gray-700"
                >
                Annuler
                </Button>
                <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 rounded-full"
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

export default AjoutProjetModal