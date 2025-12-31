import React, {useState} from 'react'
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
import { Pencil } from "lucide-react"; 
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const actuSchema = z.object(
    {
        titre : z.string().min(5, "Le nom du catégorie est trop court."),
        contenu : z.string().min(15, "La description est trop courte."),
        source : z.string().min(5, "La source est trop courte.").optional(),
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

const ModifPresseModal = ({value, onUpdate}) => {

    const [dialogOpen, setDialogOpen] = useState(false)

    const {
            register,
            handleSubmit,
            reset,
            formState : {errors}
        } = useForm(
            {
                resolver : zodResolver(actuSchema),
                defaultValues : {
                    titre : value.titre,
                    contenu : value.contenu,
                    source : value.source,
                }
            }
    )

    const submit = (data) => {
        console.log("Envoyé")
        if(data.titre && data.contenu) {
            const dataWithId = {...data, id : value.id}
            onUpdate(dataWithId)
        }

       /* reset({
            titre : '',
            contenu : '',
            image : ''
        })*/

        setDialogOpen(false)
    }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
            <button className="bg-blue-500 text-white rounded-full p-2 shadow-sm cursor-pointer">
                <Pencil size={16} />
            </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10 bg-white">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-700">Modifier la presse</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(submit)} encType="multipart/form-data">

                {/* titre de l'actu */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="titre" className="font-medium text-gray-700">Titre :</label>
                    <Input
                        id="titre"
                        {...register("titre")}
                        className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10" 
                    />
                    {errors.titre && <p className='text-red-500 text-[12px]'>{errors.titre.message}</p>}
                </div>

                {/* source de l'actu */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="source" className="font-medium text-gray-700">Source :</label>
                    <Input
                        id="titre"
                        {...register("source")}
                        className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10" 
                    />
                    {errors.source && <p className='text-red-500 text-[12px]'>{errors.source.message}</p>}
                </div>                

                
                {/* sa description */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="contenu" className="font-medium text-gray-700">Description :</label>
                    <Textarea
                        id="contenu"
                        {...register("contenu")}
                        className="col-span-3 text-gray-800 resize-none border-gray-400"
                        rows={3} 
                    />
                    {errors.contenu && <p className='text-red-500 text-[12px]'>{errors.contenu.message}</p>}
                </div>

                {/* Image de la description */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="image" className="font-medium text-gray-700">Image :</label>
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
                <DialogFooter className="flex justify-end gap-3 mt-3">
                    <Button type="button" onClick={() => setDialogOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full">Annuler</Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">Sauvegarder</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>  
)
}

export default ModifPresseModal