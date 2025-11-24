import React from 'react'
import { Edit } from 'lucide-react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getData } from '@/service/api';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const serviceSchema = z.object(
    {
        nom : z.string().min(2, "Le titre est trop court"),
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
        description : z.string().min(15, 'La description est trop court'),
        button : z.string().min(2, "Le texte du button est trop court"),
        categorie : z.string().min(1, "Veuillez choisir au moins un categorie")
    }
)

const ModifierServiceModal = ({ value,  onUpdate }) => {

    const [dialogOpen, setDialogOpen] = useState(false)
    const [categories, setCategories] = useState([])

    const {
        register,
        handleSubmit,
        reset,
        formState : {errors}
    } = useForm({
        resolver : zodResolver(serviceSchema),
        defaultValues : value
    })

    const fetchCategories = async () => {
        try {
            const response = await getData("/categories/")
            setCategories(response.data)
        } catch (err) {
            console.log("Erreur lors de la récupération des catégories : ", err);
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const submit = (data) => {
        if(data.nom && data.description) {
            const dataWithId = { ...data, id: value.id };
            onUpdate(dataWithId)
        }

        setDialogOpen(false)
    }
    
  return (
    <div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button
                //onClick={() => openEditDialog(row)}
                className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg rounded-full h-8 w-8 p-1 transition-all'
                size="icon"
                title="Modifier le service"
                >
                    <Edit className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-indigo-700">
                    Modifier le service
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(submit)} encType="multipart/form-data">
                    <div className='grid gap-4 py-4'>
                        {/* Champ Nom */}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="nom" className="font-medium text-gray-700">
                                Nom du service : 
                            </label>
                            <Input
                                {...register("nom")}
                                // Assurer la visibilité du texte
                                className="col-span-3 text-gray-800 border-gray-400 rounded-lg h-10" 
                            />
                            {errors.nom && <p className='text-red-500 text-[12px]'>{errors.nom.message}</p>}
                        </div>

                        {/* Champ Description */}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="description" className="font-medium text-gray-700">
                                Description : 
                            </label>
                            <Textarea
                                id="description"
                                name="description"
                                {...register("description")}
                                // Assurer la visibilité du texte
                                className="col-span-3 resize-none text-gray-800 border-gray-400"
                                rows={4}
                            />
                            {errors.description && <p className='text-red-500 text-[12px]'>{errors.description.message}</p>}
                        </div>

                        {/* champ button */}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="button" className="font-medium text-gray-700">
                                Button : 
                            </label>
                            <Input
                                id="button"
                                name="button"
                                {...register("button")}
                                // Assurer la visibilité du texte
                                className="col-span-3 resize-none text-gray-800 border-gray-400 rounded-lg h-10"
                                rows={4}
                            />
                            {errors.button && <p className='text-red-500 text-[12px]'>{errors.button.message}</p>}
                        </div>

                         {/* Champ Image URL */}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="image" className="font-medium text-gray-700">
                                Image : <span className="text-rose-500">*</span>
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
                                accept={ACCEPTED_IMAGE_TYPES.join(', ')}
                                {...register("image")}
                                className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10"
                            />
                            {errors.image && <p className='text-red-500 text-[12px]'>{errors.image.message}</p>}
                        </div>


                        {/* Catégorie (Rendu modifiable) */}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="categorie" className="font-medium text-gray-700">
                                Catégorie : 
                            </label>
                            <select name="" id="" className='flex w-full items-center justify-between    rounded-md border  bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-800 border-gray-400 h-10' {...register("categorie")}>
                                <option value={value.id}>{value.categorie}</option>
                                {categories && categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                ))}
                            </select>
                            {errors.categorie && <p className='text-red-500 text-[12px]'>{errors.categorie.message}</p>}
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
                        Enregister
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
      </Dialog>
    </div>
  )
}

export default ModifierServiceModal