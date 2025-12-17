import React from "react"; 
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/Typographie";
import { createData } from "@/service/api";
import StepicPosition from "../components/StepicPosition";
import { motion } from "framer-motion";
import headerContact from "@/assets/headerContact.webp";

const PRIMARY_PURPLE = '#6c63ff'
const DARK_PURPLE = '#8a2be2'
const backgroundImageURL = headerContact;

// Animation texte
const textAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

// Slide variants
const slideFromLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideFromRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// Schéma de validation
const schema = z.object({
  nomClient: z.string().min(3, "Le nom est trop court"),
  emailClient: z.string().email("Email invalide"),
  sujet: z.string().min(3, "Le sujet est trop court"),
  contenu: z.string().optional(),
});

function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data)
    try {
      await createData("messages/", data)
    } catch (err) {
      console.log("Erreur lors de l'envoie du message : ", err)
    }

    reset({
      nomClient : '',
      emailClient : '',
      sujet : '',
      contenu : ''
    })
  }

  return (
    <div id="contact" className="bg-white">
      <div className=" w-full">

        <div
          className="relative min-h-[50vh] flex flex-col rounded-xl justify-center items-center 
                     text-center text-white px-4 sm:px-6 md:px-8 lg:px-10 overflow-hidden w-full bg-top sm:bg-center"
          style={{
            backgroundImage: `url('${backgroundImageURL}')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            minHeight: '700px' 
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gray-900 opacity-60 rounded-xl"></div>

          {/* Titre */}
          <div className="flex flex-col gap-10">
            <motion.h2
              variants={textAnim}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl md:text-6xl
            font-bold text-white
            mb-6 sm:mb-8 md:mb-10
            leading-tight drop-shadow-sm"
            >
              Contactez-nous !
            </motion.h2>
            
            <motion.p
              variants={textAnim}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative text-center text-lg max-w-3xl z-10"
            >
              Parlez-nous en ou bien posez-nous vos questions. Notre équipe vous répondra dans les plus brefs délais.
            </motion.p>
          </div>
        </div>

        {/* Texte section */}
<div className="flex flex-col justify-center items-center text-center gap-6 px-4 sm:px-6 md:px-8">

  <motion.h2
    variants={textAnim}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="
      text-3xl sm:text-4xl md:text-5xl
      font-bold text-gray-500
      mb-4 sm:mb-6 md:mb-8
      leading-tight drop-shadow-sm 
      pt-6 
      w-full 
      text-center
    "
  >
    Nous sommes à votre écoute !
  </motion.h2>

  <motion.p
    variants={textAnim}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="
      relative text-center text-sm sm:text-base max-w-3xl z-10 text-gray-500
    "
  >
    Que vous soyez prêt à lancer votre projet, à demander un devis détaillé, ou
    simplement à explorer les possibilités avec notre équipe, utilisez le formulaire 
    ci-dessous. Nous nous engageons à vous apporter une réponse personnalisée et 
    pertinente dans un délai maximal de 24 heures ouvrées.
  </motion.p>
</div>


{/* Formulaire + Map */}
<div className="
  grid grid-cols-1 
  lg:grid-cols-2 
  gap-12 
  pt-16 sm:pt-20 
  px-4 sm:px-8 md:px-12 lg:px-20 
  py-12 sm:py-16
">

  {/* FORMULAIRE - slide depuis la gauche */}
  <motion.div
    variants={slideFromLeft}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    className="
      rounded-2xl 
      bg-white  
      p-4 sm:p-6 md:p-8 
      flex items-center
      w-full
    "
  >
    <div className="w-full">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Nom + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium mb-1 block text-gray-900">
              Nom :
            </label>
            <input
              {...register("nomClient")}
              placeholder="Votre nom"
              className="w-full h-12 px-3 rounded-xl text-gray-900 placeholder-gray-500 
              outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
            />
            {errors.nomClient && (
              <p className="text-red-500 text-xs mt-1">{errors.nomClient.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block text-gray-900">
              Email :
            </label>
            <input
              {...register("emailClient")}
              placeholder="ex@gmail.com"
              className="w-full h-12 px-3 rounded-xl text-gray-900 placeholder-gray-500 
              outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
            />
            {errors.emailClient && (
              <p className="text-red-500 text-xs mt-1">{errors.emailClient.message}</p>
            )}
          </div>
        </div>

        {/* Sujet */}
        <div>
          <label className="text-sm font-medium mb-1 block text-gray-900">
            Sujet :
          </label>
          <input
            {...register("sujet")}
            placeholder="Votre sujet"
            className="w-full h-12 px-3 rounded-xl text-gray-900 placeholder-gray-500 
            outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
          />
          {errors.sujet && (
            <p className="text-red-500 text-xs mt-1">{errors.sujet.message}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="text-sm font-medium mb-1 block text-gray-900">
            Message :
          </label>
          <textarea
            {...register("contenu")}
            placeholder="Tapez votre message..."
            className="w-full h-32 px-3 py-2 rounded-xl text-gray-900 placeholder-gray-500 
            outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400 transition resize-none"
          />
          {errors.contenu && (
            <p className="text-red-500 text-xs mt-1">{errors.contenu.message}</p>
          )}
        </div>

        {/* Button */}
        <div className="flex justify-center sm:justify-end">
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="
              flex items-center justify-center gap-2 px-6 py-2 rounded-full  text-white font-semibold bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] hover:from-[#6c63ff] hover:to-[#8a2be2] shadow-lg transition-colors duration-300 h-10 w-40 md:h-12 md:w-48 cursor-pointer
            "
          >
            Envoyer
          </Button>
        </div>

      </form>

    </div>
  </motion.div>

  {/* MAP - slide depuis la droite */}
  <motion.div
    variants={slideFromRight}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    className="
      rounded-2xl 
      p-0 
      overflow-hidden 
      w-full 
      h-[350px] sm:h-[420px] md:h-[500px]
    "
  >
    <div className="w-full h-full p-0">
      <StepicPosition />
    </div>
  </motion.div>

</div>

      </div>
    </div>
  );
}

export default ContactPage;
