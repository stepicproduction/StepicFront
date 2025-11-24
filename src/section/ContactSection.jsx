import React from "react"; 
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/Typographie";
import { createData } from "@/service/api";
import StepicPosition from "../components/StepicPosition";

const PRIMARY_PURPLE = '#6c63ff'
const DARK_PURPLE = '#8a2be2'

// Schéma de validation
const schema = z.object({
  nomClient: z.string().min(3, "Le nom est trop court"),
  emailClient: z.string().email("Email invalide"),
  sujet: z.string().min(3, "Le sujet est trop court"),
  contenu: z.string().optional(),
});

function ContactSection() {
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
    <div id="contact" className="py-16 px-6 lg:px-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <H2 className="text-3xl md:text-4xl text-center mb-12 text-gray-900 font-bold drop-shadow-lg">
          Contactez-nous
        </H2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Conteneur externe avec bordure en dégradé */}
          <div className="rounded-2xl p-1 flex items-center"
               style={{ 
                 background: "linear-gradient(135deg, #0f172a, #3b82f6, #8b5cf6)" 
               }}
          >
            {/* Formulaire à l’intérieur du conteneur */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-1 block text-gray-900">Nom :</label>
                    <input
                      {...register("nomClient")}
                      placeholder="Votre nom"
                      className="w-full h-12 px-3 rounded-xl text-gray-900 placeholder-gray-500 outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {errors.nomClient && (
                      <p className="text-red-500 text-xs mt-1">{errors.nomClient.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block text-gray-900">Email :</label>
                    <input
                      {...register("emailClient")}
                      placeholder="ex@gmail.com"
                      className="w-full h-12 px-3 rounded-xl text-gray-900 placeholder-gray-500 outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {errors.emailClient && (
                      <p className="text-red-500 text-xs mt-1">{errors.emailClient.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-900">Sujet :</label>
                  <input
                    {...register("sujet")}
                    placeholder="Votre sujet"
                    className="w-full h-12 px-3 rounded-xl text-gray-900 placeholder-gray-500 outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                  />
                  {errors.sujet && (
                    <p className="text-red-500 text-xs mt-1">{errors.sujet.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-900">Message :</label>
                  <textarea
                    {...register("contenu")}
                    placeholder="Tapez votre message..."
                    className="w-full h-32 px-3 py-2 rounded-xl text-gray-900 placeholder-gray-500 outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400 transition resize-none"
                  />
                  {errors.contenu && (
                    <p className="text-red-500 text-xs mt-1">{errors.contenu.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] hover:from-[#6c63ff] hover:to-[#8a2be2] shadow-lg transition-colors duration-300 cursor-pointer h-14 md:h-12 w-48 font-semibold text-base"
                  >
                    Envoyer
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Géolocalisation */}
          <div className="rounded-2xl shadow-lg p-0 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-400 to-purple-600">
            <div className="w-full h-full p-8 text-white">
              <StepicPosition />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ContactSection;
