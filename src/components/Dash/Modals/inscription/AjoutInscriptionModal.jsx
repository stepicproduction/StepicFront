import React, { useState, useEffect } from 'react'
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
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/*const inscriptionSchema = z.object({
    prenomClient: z.string().min(2, "Le prénom est requis et doit contenir au moins 2 caractères."),
    nomClient: z.string().min(2, "Le nom est requis et doit contenir au moins 2 caractères."),
    emailClient: z.string().email("L'adresse email n'est pas valide."),
    telephoneClient: z.string().regex(/^[0-9]{10}$/, "Le téléphone doit contenir 10 chiffres (sans espaces ni tirets)."),
    categorie: z.string().min(1, "Veuillez choisir une catégorie."),
    service: z.array(z.string()).min(1, "Veuillez sélectionner au moins un service pour continuer."),
})*/

const AjoutInscriptionModal = ({ onCreate }) => {
    
    const [dialogOpen, setDialogOpen] = useState(false)
    const [categorie, setCategorie] = useState([])
    const [offres, setOffres] = useState([])

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState : { errors },
    } = useForm({
        resolver : zodResolver(GlobalSchema)
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
        reset({
            nomClient : '',
            prenomClient : '',
            emailClient : '',
            telephoneClient : '',
            categorie : '',
            service : ''
        })

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
        // Condition 1: categories.length > 0 (Les options sont chargées)
        // Condition 2: categorieWatch (Une catégorie a été passée en valeur par défaut)
        if (categorie.length > 0 && categorieWatch) {
            
            // 1. Vérifiez si la valeur par défaut de RHF est l'option "vide" (valeur "")
            //    Si c'est le cas, cela signifie que la présélection n'a pas encore été synchronisée.
            
            // Note: Comme categorieWatch est la valeur passée, si elle est non-vide, on l'applique.
            // On vérifie que la catégorie existe dans la liste pour éviter les erreurs.
            const targetId = String(categorieWatch);
            const isCategoryAvailable = categorie.some(cat => String(cat.id) === targetId);

            if (isCategoryAvailable) {
                // Utiliser setValue() pour forcer le <select> à afficher la valeur
                setValue("categorie", targetId, { shouldValidate: true, shouldDirty: true });
            }
        }
    }, [categorie, categorieWatch, setValue])
        
    useEffect(() => {
        // Le `watch` renvoie une string (l'ID). On s'assure qu'il est valide
        if (categorieWatch) {
            fetchOffreByCat(categorieWatch)
        } else {
                // Vider les offres si aucune catégorie n'est sélectionnée
            setOffres([]);
        }
    }, [categorieWatch])    


    const submit = (data) => {
        if(data.nomClient && data.prenomClient) {
            onCreate(data)
        }

        fermerModal()
    }


  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
            <Button
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-full shadow-lg transition-all duration-300 w-[250px] hover:scale-105"
            >
                <Plus className="w-5 h-5" />
                Nouvelle Inscription
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-700">Nouvelle Inscription</DialogTitle>
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
                                        <input 
                                            type="checkbox" 
                                            id={`service-${item.id}`} // ID unique pour l'accessibilité
                                            // On utilise l'ID du service comme valeur
                                            value={item.id} 
                                            className='text-[#8a2be2] focus:ring-[#8a2be2] rounded' 
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

export default AjoutInscriptionModal