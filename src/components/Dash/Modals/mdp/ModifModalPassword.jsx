import React, { useState } from 'react'
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

const passwordSchema = z.object(
    {
        ancien_mdp: z.string(8, "L'ancien mot de passe est trop court"),
        nouveau_mdp : z.string(8, "Le nouveau mot da passe est trop court"),
    }
)

const ModifModalPassword = ({ open, setOpen, onUpdate }) => {

    const {
        register,
        reset,
        handleSubmit,
        formState : {errors},
    } = useForm({
        resolver : zodResolver(passwordSchema)
    })


    const submit = (data) => {
        if(data.ancien_mdp && data.nouveau_mdp) {
            onUpdate(data)
        }

        reset({
            ancien_mdp : '',
            nouveau_mdp : ''
        })

        setOpen(false)
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] [&>button]:bg-red-500 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:rounded-full [&>button]:text-white [&>button]:hover:bg-red-600 [&>button]:hover:cursor-pointer py-10 px-10">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-700">Changer le mot de passe</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(submit)}>

                {/* ancien mot de passe*/}
                <div className='flex flex-col space-y-2 mb-4'>
                    <label htmlFor="ancien_mdp" className="font-medium text-gray-700">Ancien mot de passe :</label>
                    <Input
                        id="ancien_mdp"
                        {...register("ancien_mdp")}
                        className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10" 
                    />
                    {errors.ancien_mdp && <p className='text-red-500 text-[12px]'>{errors.ancien_mdp.message}</p>}
                </div>

                {/* nouveau mot de passe*/}
                <div className='flex flex-col space-y-2 mb-4'>
                    <label htmlFor="nouveau_mdp" className="font-medium text-gray-700">Nouveau mot de passe :</label>
                    <Input
                        id="nouveau_mdp"
                        {...register("nouveau_mdp")}
                        className="col-span-3 text-gray-800  border-gray-400 rounded-lg h-10" 
                    />
                    {errors.nouveau_mdp && <p className='text-red-500 text-[12px]'>{errors.nouveau_mdp.message}</p>}
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

export default ModifModalPassword