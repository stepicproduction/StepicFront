    import React, { useState, useEffect } from "react";
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogFooter,
      DialogDescription,
      DialogTrigger,
      DialogClose,
    } from "@/components/ui/dialog";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { MdEdit } from "react-icons/md";
    import z from "zod";
    import { useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";


    const ROLES = [
      {
        name : "Employé",
        value : "employe"
      },
      {
        name : "Admin",
        value : "admin"
      }
    ];
    const MAX_FILE_SIZE = 5000000;
    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const ROLE_VALUES = ROLES.map(role => role.value)

    const schemaUtilisateur = z.object(
      {
        username : z.string().min(2, 'Le nom est trop court.'),
        email : z.string().email("L'email est incorrect."),
        role : z.enum([ROLE_VALUES[0], ...ROLE_VALUES.slice(1)], {
          errorMap : () => ({ message : "Le role sélectionné n'est pas valide."})
        }),
        password : z.string().min(4, "Le mot de passe est trop court.").optional().or(z.literal('')),
        image : z.preprocess(
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
        )
      }
    )

    export default function ModifierUserModal({ value, onUpdate }) {
      const [open, setOpen] = useState(false);

    const {
      register,
      handleSubmit,
      reset,
      formState : {errors}
      } = useForm(
      {
          resolver : zodResolver(schemaUtilisateur),
          defaultValues : {
            username : value.username,
            password : '',
            role : value.role,
            email : value.email
          }
      }
    )

    const submit = (data) => {
        if(data.username) {
          const dataWithId = {...data, id : value.id}
          onUpdate(dataWithId)
        }

        reset(value)
        setOpen(false)
    }

    useEffect(() => {
      reset(value)
    }, [])
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          {/* Trigger du modal (Bouton Modifier) */}
          <DialogTrigger asChild>
            <Button
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg rounded-full h-8 w-8 p-1 transition-all"
                size="icon"
            >
                <MdEdit className="h-5 w-5" /> 
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-indigo-700">
                Modifier l'utilisateur
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Modifiez les informations de l'utilisateur.
              </DialogDescription>
            </DialogHeader>

            {/* FORMULAIRE (identique à l'original) */}
            <form onSubmit={handleSubmit(submit)}>

              {/* nom */}
              <div className="grid gap-4 py-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="username" className="text-right text-gray-800 font-medium">Nom :</Label>
                  <Input
                    id="nom"
                    type="text"
                    placeholder="Nom"
                    {...register("username")}
                    className="col-span-3 border-gray-400 text-gray-800 focus:border-indigo-500"
                  />
                  {errors.username && <p className='text-red-500 text-[12px]'>{errors.username.message}</p>}
                </div>

                {/* Champ Email */}
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="email" className="text-right text-gray-800 font-medium">Email :</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@gmail.com"
                  {...register("email")}
                    className="col-span-3 border-gray-400 text-gray-800 focus:border-indigo-500"
                  />
                  {errors.email && <p className='text-red-500 text-[12px]'>{errors.email.message}</p>}
                </div>

                {/* mot de passe */}
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="password" className="text-right text-gray-800 font-medium">Mot de passe :</Label>
                  <Input
                    id="password"
                    placeholder="12345678"
                  {...register("password")}
                    className="col-span-3 border-gray-400 text-gray-800 focus:border-indigo-500"
                  />
                  {errors.password && <p className='text-red-500 text-[12px]'>{errors.password.message}</p>}
                </div>

                {/* Champ image */}
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="image" className="text-right text-gray-800 font-medium">Image : </Label>
                  {value.image && (
                      <img
                        src={value.image}
                        alt="Image actuelle"
                        className="w-24 h-24 object-cover mb-2 rounded"
                      />
                    )}
                  <Input
                    id="image"
                    type="file"
                    {...register("image")}
                    className="col-span-3 border-gray-400 text-gray-800 focus:border-indigo-500"
                  />
                  {errors.image && <p className='text-red-500 text-[12px]'>{errors.image.message}</p>}
                </div>

                {/* Champ Rôle */}
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="role" className="text-right text-gray-800 font-medium">Rôle :</Label>
                  <select id="role" className='flex w-full items-center justify-between border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-800 border-gray-400 h-10' {...register("role")}>
                    {ROLES.map((role) => (
                      <option key={role.value} value={role.value}>{role.name}</option>
                    ))}
                  </select>
                  {errors.role && <p className='text-red-500 text-[12px]'>{errors.role.message}</p>}
                </div>
              </div>

              {/* FOOTER */}
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="secondary"
                    className="hover:bg-gray-200 rounded-full text-gray-700"
                  >
                    Annuler
                  </Button>
                </DialogClose>
                <Button
                  className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-600 hover:to-cyan-600 rounded-full"
                type="submit"
                >
                  Sauvegarder
                </Button>
              </DialogFooter>
            </form>

          </DialogContent>
        </Dialog>
      );
    }