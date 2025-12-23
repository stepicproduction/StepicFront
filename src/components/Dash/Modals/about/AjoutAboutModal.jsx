import React from 'react'
import { Label } from '@/components/ui/label'
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
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const aboutSchema = z.object(
    {
        titre : z.string().min(2, "Le titre est trop court"),
        contenu : z.string().min(4, "La description est trop court")
    }
)

function AjoutCommandeModal({ onCreate }) {

    // Déclarez un état pour contrôler l'ouverture/fermeture de la modale
    const [open, setOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState : {errors},
        reset
    } = useForm({
        resolver : zodResolver(aboutSchema)
    })

    const sumbit = (data) => {
        // Appeler la fonction de création avec les données validées
        if (data.titre && data.contenu) {
            onCreate(data);
            // Fermez la modale une fois que la soumission est réussie
            setOpen(false);
            reset({
                titre : '',
                contenu : ''
            })
        }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
             <Button
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            >
                <Plus className="w-5 h-5" />
                Ajouter
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10 bg-white">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-700">Nouvel "À Propos"</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(sumbit)}>
                <div>
                    <div className='flex flex-col gap-2 mb-[15px]'>
                        <label className="font-medium text-gray-700" htmlFor="titre">Titre :</label>
                        <Input type="text"
                          className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10" 
                         {...register("titre")}/>
                        {errors.titre && <p className='text-red-500 text-[12px]'>{errors.titre.message}</p>}
                    </div>
                    <div className='flex flex-col gap-2 mb-[15px]'>
                        <label htmlFor="contenu" className="font-medium text-gray-700">Description :</label>
                        <Textarea className="col-span-3 text-gray-800 resize-none border-gray-400"
                        rows={5} {...register("contenu")}/>
                        {errors.contenu && <p className='text-red-500 text-[12px]'>{errors.contenu.message}</p>}
                    </div>
                </div>
                <DialogFooter className="mt-8">
                    <DialogClose asChild>
                        <Button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full">Annuler</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">Confirmer</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default AjoutCommandeModal