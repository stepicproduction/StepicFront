import React from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const userImageSchema = z.object(
    {
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


const ModifModalImage = ({ open, setOpen, onUpdate, userImage }) => {

    const {
            register,
            handleSubmit,
            reset,
            formState : {errors}
        } = useForm(
            {
                resolver : zodResolver(userImageSchema),
            }
        )
        
    const submit = (data) => {
        onUpdate(data)
        setOpen(false)
    }    
     
        
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10 bg-white">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-700">Changer l'image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(submit)}>

                {/* Champ URL Photo */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="photo" className="font-medium text-gray-700">
                        URL Photo (Facultatif)
                    </label>
                    {userImage && (
                                <img
                                    src={userImage}
                                    alt="Image actuelle"
                                    className="w-24 h-24 object-cover mb-2 rounded-full"
                                />
                            )}
                    <Input
                        type="file"
                        id="photo"
                        {...register("image")}
                        placeholder="URL de l'image de profil"
                        className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10"
                    />
                    {errors.image && <p className='text-red-500 text-[12px]'>{errors.image.message}</p>}
                </div>
                
                <DialogFooter className="flex justify-end gap-3 mt-3">
                    <Button type="button" onClick={() => setOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full">Annuler</Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">Sauvegarder</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default ModifModalImage