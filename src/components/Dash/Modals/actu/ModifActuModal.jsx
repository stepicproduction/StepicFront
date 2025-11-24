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
import { Pencil } from "lucide-react"; 
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const actuSchema = z.object(
    {
        titreActu : z.string().min(5, "Le nom du catégorie est trop court."),
        contenuActu : z.string().min(15, "La description est trop courte."),
        imageActu : z.preprocess(
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

const ModifActuModal = ({ value, onUpdate }) => {

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
                    titreActu : value.titreActu,
                    contenuActu : value.contenuActu
                }
            }
    )

    const submit = (data) => {
        console.log("Envoyé")
        if(data.titreActu && data.contenuActu) {
            const dataWithId = {...data, id : value.id}
            onUpdate(dataWithId)
        }

        reset({
            titreActu : '',
            contenuActu : '',
            imageActu : ''
        })

        setDialogOpen(false)
    }


  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
            <button className="bg-blue-500 text-white rounded-full p-2 shadow-sm cursor-pointer">
            <Pencil size={16} />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-700">Modifier l'actualité</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(submit)} encType="multipart/form-data">

                {/* titre de l'actu */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="titreActu" className="font-medium text-gray-700">Titre :</label>
                    <Input
                        id="titreActu"
                        {...register("titreActu")}
                        className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10" 
                    />
                    {errors.titreActu && <p className='text-red-500 text-[12px]'>{errors.titreActu.message}</p>}
                </div>

                
                {/* sa description */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="contenuActu" className="font-medium text-gray-700">Description :</label>
                    <Textarea
                        id="contenuActu"
                        {...register("contenuActu")}
                        className="col-span-3 text-gray-800 resize-none border-gray-400"
                        rows={3} 
                    />
                    {errors.contenuActu && <p className='text-red-500 text-[12px]'>{errors.contenuActu.message}</p>}
                </div>

                {/* Image de la description */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="imageActu" className="font-medium text-gray-700">Image :</label>
                    {value.imageActu && (
                        <img
                            src={value.imageActu}
                            alt="Image actuelle"
                            className="w-24 h-24 object-cover mb-2 rounded"
                        />
                      )}
                    <Input
                        type="file"               
                        id="imageActu"
                        accept={ACCEPTED_IMAGE_TYPES.join(', ')}
                        {...register("imageActu")}
                        className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10"
                    />
                    {errors.imageActu && <p className='text-red-500 text-[12px]'>{errors.imageActu.message}</p>}
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

export default ModifActuModal