import React, { useState } from 'react'
import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose 
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react"; 
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const categorieSchema = z.object(
    {
        nom : z.string().min(5, "Le nom du catégorie est trop court."),
        description : z.string().min(15, "La description est trop courte."),
        button : z.string().min(2, "Le texte du bouton est trop court."),
        image : z.preprocess(
            (val) => {
                if(val instanceof FileList) return val[0];
                return val;
            },
            z.union([z.string(), z.instanceof(File), z.null()]
        ).optional().refine(
            (value) => {
                if (!value) return true;
                if(value instanceof File) {
                    return (
                        value.size <= MAX_FILE_SIZE &&
                        ACCEPTED_IMAGE_TYPES.includes(value.type)
                    )
                }
                return true;
            },
            {
                message : "Le fichier ne corresponde pas aux critères de taille ou du format."
            }
        )
        ),
    }
)

function AjoutModal({ onCreate }) {

    const [dialogOpen, setDialogOpen] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState : {errors}
    } = useForm(
        {
            resolver : zodResolver(categorieSchema)
        }
    )

    const submit = (data) => {
        console.log("Envoyé")
        if(data.nom && data.description) {
            onCreate(data)
        }

        reset({
            nom : '',
            description : '',
            image : ''
        })

        setDialogOpen(false)
    }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105">
                <Plus className="w-5 h-5" /> Ajouter
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10 bg-white">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-700">Nouvelle catégorie</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(submit)} encType="multipart/form-data">

                {/* titre de la catégorie */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="nom" className="font-medium text-gray-700">Nom :</label>
                    <Input
                        id="nom"
                        {...register("nom")}
                        className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10" 
                    />
                    {errors.nom && <p className='text-red-500 text-[12px]'>{errors.nom.message}</p>}
                </div>

                {/* texte du bouton */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="button" className="font-medium text-gray-700">Bouton :</label>
                    <Input
                        id="button"
                        {...register("button")}
                        className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10" 
                    />
                    {errors.button && <p className='text-red-500 text-[12px]'>{errors.button.message}</p>}
                </div>

                {/* sa description */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="description" className="font-medium text-gray-700">Description :</label>
                    <Textarea
                        id="description"
                        {...register("description")}
                        className="col-span-3 text-gray-800 resize-none border-gray-400"
                        rows={3} 
                    />
                    {errors.description && <p className='text-red-500 text-[12px]'>{errors.description.message}</p>}
                </div>

                {/* Image de la description */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="image" className="font-medium text-gray-700">Image :</label>
                    <Input
                        type="file"               
                        id="image"
                        accept={ACCEPTED_IMAGE_TYPES.join(', ')}
                        {...register("image")}
                        className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10"
                    />
                    {errors.image && <p className='text-red-500 text-[12px]'>{errors.image.message}</p>}
                </div>
                <DialogFooter className="flex justify-end gap-3 mt-3">
                    <Button type="button" onClick={() => setDialogOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full">Annuler</Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">Ajouter</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default AjoutModal