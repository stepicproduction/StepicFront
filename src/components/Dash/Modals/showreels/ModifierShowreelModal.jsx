import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, Film, Info, Link, Save, XCircle } from "lucide-react" ;
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; 

const showreelSchema = z.object({
    title: z.string().min(5, "Le titre est trop court."),
    description: z.string().min(5, "La description est trop courte."),
   link: z.string().min(1, "Le lien est obligatoire.").url("Ceci n'est pas une URL valide.")
})

const ModifierShowreelModal = ({ value, onUpdate, onCreate }) => {
    const [open, setOpen] = useState(false);
    
    const {
        register, 
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(showreelSchema),
        defaultValues: value || { title: '', description: '', link: '' }
    })

    useEffect(() => {
        reset(value || { title: '', description: '', link: '' });
    }, [value, reset]); // Ajout de 'open' dans les dépendances

    const handleCancel = () => {
        setOpen(false);
        reset(value || { title: '', description: '', link: '' });
    }


    const submit = (data) => {
        if (value) {
            const dataWithId = { ...data, id: value.id };
            onUpdate(dataWithId);
        } else {
            onCreate(data);
        }

        handleCancel()
    }



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition shadow-md flex-shrink-0 w-[200px]">
                    <Edit size={18} />
                    {value ? "Remplacer le lien" : "Ajouter un lien"} 
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10 bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-700">
                        {value ? "Modifier le Showreel" : "Nouveau Showreel"}
                    </DialogTitle>
                </DialogHeader>
                
                {/* FORMULAIRE DÉPLACÉ ICI - ne pas englober DialogContent */}
                <form onSubmit={handleSubmit(submit)} className="space-y-6">
                    {/* titre du showreel */}
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="title" className="font-medium text-gray-700 flex items-center gap-2">
                            <Film className="h-4 w-4" /> Nom du Showreel : 
                        </label>
                        <Input
                            id="title"
                            type="text"
                            {...register("title")}
                            placeholder="Entrez le titre de la nouvelle vidéo"
                            className="col-span-3 text-gray-800 border-gray-400 rounded-lg h-10" 
                        />
                        {errors.title && <p className='text-red-500 text-[12px]'>{errors.title.message}</p>}   
                    </div>

                    {/* sa description */}
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="description" className="font-medium text-gray-700 flex items-center gap-2">
                            <Info className="h-4 w-4" /> Description : 
                        </label>
                        <Textarea
                            id="description"
                            rows={3}
                            {...register("description")}
                            placeholder="Entrez la description de la vidéo"
                            className="col-span-3 text-gray-800 border-gray-400" 
                        />
                        {errors.description && <p className='text-red-500 text-[12px]'>{errors.description.message}</p>}   
                    </div>

                    {/* et son lien */}
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="link" className="font-medium text-gray-700 flex items-center gap-2">
                            <Link className="h-4 w-4" /> URL : 
                        </label>
                        <Input
                            id="link"
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=..."
                            {...register("link")}
                            className="col-span-3 text-gray-800 border-gray-400 rounded-lg h-10" 
                        />
                        {errors.link && <p className='text-red-500 text-[12px]'>{errors.link.message}</p>}    
                    </div>
                    
                    <DialogFooter className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            onClick={handleCancel}
                            variant="secondary"
                            className="flex items-center gap-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400"
                        >
                            <XCircle size={18} /> Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition w-[50%]"
                        >
                            <Save size={18} /> 
                            <span>{value ? "Sauvegarder l'url" : "Ajouter l'url"}</span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ModifierShowreelModal;