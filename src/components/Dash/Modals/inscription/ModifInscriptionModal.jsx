import React, { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GlobalSchema } from '@/page/inscription_form/schema'
import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { getData } from '@/service/api'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Checkbox = ({ id, ...props }) => (
    <input 
        type="checkbox" 
        id={id} 
        className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500' 
        {...props} 
    />
);

const ModifInscriptionModal = ({ value, onUpdate }) => {

    const [dialogOpen, setDialogOpen] = useState(false)
    const [categorie, setCategorie] = useState([])
    const [offres, setOffres] = useState([])

    const initialDefaultValues = useMemo(() => {
        if (!value) return {};
        return {
            ...value,
            // Convertit tous les IDs de service en chaînes
            categorie: String(value.categorie || ''), // S'assurer que la catégorie est une chaîne
            service: Array.isArray(value.service) ? value.service.map(String) : [],
        };
    }, [value]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState : { errors },
    } = useForm({
        resolver : zodResolver(GlobalSchema),
        defaultValues : initialDefaultValues
    })

    const categorieWatch = watch("categorie")

    const fetchCategories = async () => {
        try {
            const response = await getData("/categories/with_inscription/")
            console.log(response.data)
            setCategorie(response.data)
        } catch (err) {
            console.log("Erreur lors de la récupération des catégories : ", err)
        }
    }

    const fermerModal = () => {
        reset(initialDefaultValues)
        setDialogOpen(false)
    }

    const fetchOffreByCat = async (id) => {
        if(!id) return
        try {
            const response = await getData(`/services/by_categorie/${id}`)
            console.log(`Offre de la categorie ${id} : ${response.data}`)
            setOffres(response.data)
        } catch (err) {
            console.log("Erreur lors de la récupération des offres : ", err)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        if (initialDefaultValues.categorie && categorie.length > 0) {
            fetchOffreByCat(initialDefaultValues.categorie);
        }
    }, [initialDefaultValues.categorie, categorie]);
        
    useEffect(() => {
            // Le `watch` renvoie une string (l'ID). On s'assure qu'il est valide
            if (categorieWatch) {
                fetchOffreByCat(categorieWatch)
            } else {
                 // Vider les offres si aucune catégorie n'est sélectionnée
                setOffres([]);
                setValue("service", []);
            }
    }, [categorieWatch, setValue])    

    const submit = (data) => {
        if(data.nomClient && data.prenomClient) {
            const dataWithId = {...data, id : initialDefaultValues.id }
            onUpdate(dataWithId)
        }

        fermerModal()
    }


  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
           <button  className="bg-blue-500 text-white rounded-full p-2 shadow-sm cursor-pointer">
              <Pencil size={16} />
            </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-700">Modifier l'nscription</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(submit)} encType="multipart/form-data" className="max-h-[70vh] overflow-y-auto p-4 space-y-4">

                <div className=''>
                    {/* nom du client */}
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="nomClient" className="font-medium text-gray-700">Nom :</label>
                        <Input
                            id="nomClient"
                            {...register("nomClient")}
                            className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10" 
                        />
                        {errors.nomClient && <p className='text-red-500 text-[12px]'>{errors.nomClient.message}</p>}
                    </div>

                    
                    {/* prenom du client */}
                    <div className=''>
                        <label htmlFor="prenomClient" className="font-medium text-gray-700">Prénom(s) :</label>
                        <Input
                            id="prenomClient"
                            {...register("prenomClient")}
                            className="col-span-3 text-gray-800 resize-none rounded-lg border-gray-400"
                        />
                        {errors.prenomClient && <p className='text-red-500 text-[12px]'>{errors.prenomClient.message}</p>}
                    </div>
                </div>

                <div className=''>
                    {/* email */}
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="emailClient" className="font-medium text-gray-700">Email :</label>
                        <Input               
                            id="emailClient"
                            {...register("emailClient")}
                            className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10"
                        />
                        {errors.emailClient && <p className='text-red-500 text-[12px]'>{errors.emailClient.message}</p>}
                    </div>

                    {/* telephone */}
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="telephoneClient" className="font-medium text-gray-700">Telephone :</label>
                        <Input               
                            id="telephoneClient"
                            {...register("telephoneClient")}
                            className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10"
                        />
                        {errors.telephoneClient && <p className='text-red-500 text-[12px]'>{errors.telephoneClient.message}</p>}
                    </div>
                </div>

                <div className=''>
                    {/* categorie */}
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="emailClient" className="font-medium text-gray-700">Categories :</label>
                        <select name="" id="" className='flex w-full items-center justify-between    rounded-md border  bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-800 border-gray-400 h-10' {...register("categorie")}>
                            <option>---Choisissez une catégorie</option>
                            {categorie && categorie.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.nom}</option>
                            ))}
                        </select>
                        {errors.categorie && <p className='text-red-500 text-[12px]'>{errors.categorie.message}</p>}
                    </div>

                    {/* services */}
                    <div className='mt-6 flex flex-col space-y-2'>
                        <label htmlFor="service" className="font-medium text-gray-700">Choisissez les services qui vous conviennent :</label>
                        {categorieWatch && offres.length > 0 ? (
                            <div className='space-y-2 grid grid-cols-2'>
                                {offres.map(item => (
                                    <div key={item.id} className='flex gap-2 items-center'>
                                        <Checkbox 
                                            id={`service-${item.id}`} 
                                            // FIX 3: La valeur doit être une chaîne pour correspondre au tableau initialDefaultValues.service
                                            value={String(item.id)} 
                                            {...register("service")} 
                                         />
                                        <label htmlFor={`service-${item.id}`} className='cursor-pointer font-medium text-gray-700'>{item.nom}</label>
                                    </div>
                                ))}
                            </div>
                        ) : categorieWatch ? (
                            <p className='text-sm italic text-gray-600'>Aucun service trouvé pour cette catégorie.</p>
                        ) : (
                            <p className='text-sm italic text-gray-600'>Sélectionnez une catégorie pour voir les services disponibles.</p>
                        )}

                        {errors.service && <p className='text-sm text-red-500 mt-2'>{errors.service.message}</p>}
                    </div>
                </div>


                <DialogFooter className="flex justify-end gap-3 mt-3">
                    <Button type="button" onClick={() => fermerModal()} className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full">Annuler</Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">Ajouter</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>    
    )
}

export default ModifInscriptionModal