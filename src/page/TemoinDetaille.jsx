import React, { useState } from 'react';
import { H2 } from '@/components/Typographie';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { createFormData } from '@/service/api';
import { Loader, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const temoinSchema = z.object(
  {
    nomClient : z.string().min(2, "Le nom est trop court."),
    prenomClient : z.string().min(2, "Le prenom est trop court."),
    messageClient : z.string().min(2, "Phrase trop court."),
    role : z.string().min(2, "La designation est trop courte."),
    email : z.string().email("L'email est invalide."),
    note : z.number().min(1, "Veuillez donner un note."),
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
    
  }
)

function TemoinDetaille() {

  const [note, setNote] = useState(0);
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)  

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState : {errors}
  } = useForm({
    resolver : zodResolver(temoinSchema)
  })

  const submit = async (data) => {
    console.log(data)

    const formData = new FormData()

    formData.append("nomClient", data.nomClient)
    formData.append("prenomClient", data.prenomClient)
    formData.append("emailClient", data.emailClient)
    formData.append("messageClient", data.messageClient)
    formData.append("note", data.note)
    formData.append("role", data.role)

    if(data.image) {
      formData.append("image", data.image)
    }

    try {
      setLoading(true)
      setSuccess(false)
            
      await createFormData("temoignages/", formData)
      console.log("Données envoyés avec succès")

      setLoading(false)
      setSuccess(true)

      setTimeout(() => {
        setSuccess(false);
      }, 2000);

    } catch (err) {
      console.log("Erreur lors de l'envoie du temoignage : ", err)
      setLoading(false)
    }

    reset({
      nomClient : '',
      prenomClient : '',
      role : '',
      email : '',
      messageClient : '',
      note : 0,
    })

    setNote(0);
  }


  const handleNoteChange = (value) => {
    setNote(value);
    setValue("note", Number(value), { shouldValidate: true });
  };

  return (
    // CHANGEMENT 1 : max-w-2xl au lieu de max-w-md pour avoir plus de place en largeur
    <div className="max-w-2xl mx-auto p-6 mt-10 pt-13">
      <H2 className="text-center mb-6">Laissez votre avis</H2>

      {/* CHANGEMENT 2 : Utilisation de Grid (2 colonnes sur PC, 1 sur mobile) */}
      <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Note Étoiles (Prend toute la largeur : col-span-2) */}
        <div className="md:col-span-2 flex flex-col items-center">
          <label className="block text-gray-700 font-medium mb-1">Votre Note :</label>
          <input type="hidden" {...register("note")} />
          <div className="flex gap-1 items-center justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                onClick={() => handleNoteChange(i)}
                className={`w-7 h-7 cursor-pointer ${i <= note ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-gray-600">{note} / 5</span>
          </div>
          {errors.note && <p className='text-red-500 text-[12px]'>{errors.note.message}</p>}
        </div>

        {/* Nom (Colonne 1) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor='nomClient'>
            Nom :  <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id='nomClient'
            {...register("nomClient")}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            placeholder="Votre nom"
            required
          />
          {errors.nomClient && <p className='text-red-500 text-[12px]'>{errors.nomClient.message}</p>}
        </div>

        {/* Prénom (Colonne 2) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor='prenomClient'>Prénom(s) : </label>
          <input
            id='prenomClient'
            type="text"
            {...register("prenomClient")}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            placeholder="Votre prénom"
          />
           {errors.prenomClient && <p className='text-red-500 text-[12px]'>{errors.prenomClient.message}</p>}
        </div>

        {/* Désignation (Colonne 1) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor='role'>Désignation</label>
          <input
            id='role'
            type="text"
            {...register("role")}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            placeholder="Ex: Développeur"
          />
          {errors.role && <p className='text-red-500 text-[12px]'>{errors.role.message}</p>}
        </div>

        {/* Email (Colonne 2) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor='email'>Email</label>
          <input
            type="email"
            id='email'
            {...register("email")}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            placeholder="Exemple@gmail.com"
          />{errors.email && <p className='text-red-500 text-[12px]'>{errors.email.message}</p>}
        </div>

        {/* Témoignage (Prend toute la largeur : col-span-2) */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1" htmlFor='messageClient'>
            Votre Témoignage :  <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("messageClient")}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            placeholder="Écrivez votre témoignage ici..."
            rows="3" // J'ai réduit un peu rows de 4 à 3 pour gagner de la place
            required
          ></textarea>
          {errors.messageClient && <p className='text-red-500 text-[12px]'>{errors.messageClient.message}</p>}
        </div>

        {/* Photo de Profil (Prend toute la largeur ou une colonne, au choix. Ici toute la largeur pour l'esthétique) */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1" htmlFor='image'>Image : </label>
          <input
            type="file"
            id='image'
            accept={ACCEPTED_IMAGE_TYPES.join(', ')}
            {...register("image")}
            className="w-full text-gray-600 cursor-pointer border border-gray-200 rounded-lg p-1"
          />
          {errors.image && <p className='text-red-500 text-[12px]'>{errors.image.message}</p>}
        </div>
        <button
          type="submit"
          className={`${loading ? "cursor-not-allowed opacity-10" : "cursor-pointer"} md:col-span-2 w-full max-w-xs mx-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full`}
        >
          <AnimatePresence>
            {!loading && !success && (
              <span>Envoyer le témoignage</span>
            )}

            {loading && (
              <div className='flex gap-1.5 justify-center'>
                <motion.span
                  key={loading}
                  initial={{opacity : 0, rotate : -90}}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="animate-spin"
                >
                  <Loader size={20} />
                </motion.span>
                Envoie du témoignage
              </div>
            )}

            {success && (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='flex gap-1.5 justify-center'
              >
                <Check size={22} /> Envoyé avec succès
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </form>
    </div>
  );
}

export default TemoinDetaille;
