import React, { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'

const aboutSchema = z.object(
    {
        titre : z.string().min(2, "Le titre est trop court"),
        contenu : z.string().min(4, "La description est trop court")
    }
)

function ModifierCommandeModal({value, onUpdate}) {

    const [open, setOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState : {errors}
    } = useForm({
        resolver : zodResolver(aboutSchema),
        defaultValues : value
    })

    const sumbit = (data) => {
        if (data.titre && data.contenu) {
            const dataWithId = { ...data, id: value.id };
            onUpdate(dataWithId);
            setOpen(false);
        }
    }

    useEffect(() => {
        reset(value)
    }, [value, reset])
    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <button className="bg-blue-500 text-white rounded-full p-2 shadow-sm cursor-pointer">
                <Pencil size={16} />
          </button>
        </DialogTrigger>
        <DialogContent  className="sm:max-w-[500px] [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10">
            <DialogHeader>
                <DialogTitle className="text-center text-[#8a2be2] text-4xl mb-7">Mis à jour de l'about</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(sumbit)}>
                <div>
                    <div className='flex flex-col gap-2 mb-[15px]'>
                        <label htmlFor='titre' className="text-gray-500 mr-7">Titre :</label>
                        <Input type="text" className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10"  {...register("titre")}/>
                        {errors.titre && <p className='text-red-500 text-[12px]'>{errors.titre.message}</p>}
                    </div>
                    <div className='flex flex-col gap-2 mb-[15px]'>
                        <label htmlFor='contenu' className="text-gray-500 mr-7">Description :</label>
                        <Textarea className="col-span-3 text-gray-800 resize-none border-gray-400"
                        rows={5} {...register("contenu")}/>
                        {errors.contenu && <p className='text-red-500 text-[12px]'>{errors.contenu.message}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full">Annuler</Button>
                    </DialogClose>
                     <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">Sauvegarder</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default ModifierCommandeModal