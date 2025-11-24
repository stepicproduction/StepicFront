import React, { useState } from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { useAuth } from '@/service/AuthContext'
import { UserRound, LogOut, Edit, Edit2Icon } from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger, 
} from './ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import ModifModalPassword from './Dash/Modals/mdp/ModifModalPassword'
import ModifModalImage from './Dash/Modals/mdp/ModifModalImage'
import { createData, patchFormData } from '@/service/api'

function HeaderDash() {
  const { username, role, userImage, logout, userEmail, userId, updateUserImage: updateContextImage } = useAuth()
  const navigate = useNavigate()

  const imgProfil = userImage ? userImage : "https://www.gravatar.com/avatar/?d=mp&s=150"

  const [isModalPassword, setIsModalPassword ] = useState(false)
  const [isModalImage, setIsModalImage] = useState(false)

  const openModalPassword = () => {
    setIsModalPassword(true)
  }

  const openModalImage = () => {
    setIsModalImage(true)
  }

  const roleUser = role == 'admin' ? 'Admin' : 'Employé'

  const updateUserPassword = async (data) => {
    try {
      await createData(`utilisateurs/${userId}/changer-mdp/`, data)
      console.log("Mot de passe changé avec succès!")
      handleLogOut()
    } catch (err) {
      console.log("Erreur lors du changement du mot de passe : ", err)
    }
  }

  const updateUserImage = async (data) => {
    const formData = new FormData()
    formData.append('image', data.image)

    //recuperer le token
    const accessToken = localStorage.getItem('access_token')

    console.log('accessToken : ', accessToken)

    if(!accessToken) {
      console.error("Token manquant. Déconnexion!")
      handleLogOut()
      return
    }

    try {

      const response = await patchFormData(`utilisateurs/${userId}/`, formData, {
        headers : {
          'Authorization' : `Bearer ${accessToken}`,
        }
      })

      const newImageUrl = response.data.image;
      updateContextImage(newImageUrl);

    } catch (err) {
      console.log("erreur lors du chargement de l'image : ", err)
    }
  }

  const handleLogOut = () => {
    logout()
    navigate('/login')
  }


  return (
    <div className='w-full bg-white h-[80px] px-7 text-black flex items-center justify-between gap-2'>
        <SidebarTrigger className="border-none hover:bg-white"/>

        <div className='flex justify-between gap-4 items-center'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className='h-10 w-10 rounded-full border border-black flex items-center justify-center'>
                <img src={imgProfil} className='h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm cursor-pointer'/>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-xs text-center px-8 py-4'>
              <DropdownMenuLabel>
                <div className='flex flex-col items-center justify-center gap-2 relative'>
                  {userImage ? <img src={userImage} className='h-30 w-30 rounded-full object-cover border border-gray-200 shadow-sm cursor-pointer'/> : <UserRound />}
                  <div className='flex flex-col items-center gap-1'>
                    <span className='font-bold text-lg'>{username || 'Utilisateur'} </span>
                    <span className='text-gray-400 text-[14px]'> {userEmail} / {roleUser} </span>
                  </div>
                  <button onClick={openModalImage} className='absolute bottom-16 right-18 rounded-full w-8 h-8 flex items-center justify-center bg-white'>
                    <Edit className='cursor-pointer'/>
                  </button>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

             
              <DropdownMenuItem className='mb-2 cursor-pointer' onSelect={openModalPassword}>
                <Edit2Icon className="mr-2 h-4 w-4"/>
                <span>Changer le mot de passe</span>
              </DropdownMenuItem>

              <DropdownMenuItem className='mb-2'>
                <LogOut className="mr-2 h-4 w-4"/>
                <Button variant="link" onClick={handleLogOut} className='cursor-pointer ml-0'>Déconnexion</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <div className='flex flex-col items-center '>
            <span className='font-bold'>{username || 'Utilisateur'} </span>
            <span className='text-gray-400 text-[12px]'> {roleUser} </span>
            </div> */}
          <ModifModalPassword open={isModalPassword} setOpen={setIsModalPassword} onUpdate={updateUserPassword} />
          <ModifModalImage open={isModalImage} setOpen={setIsModalImage} onUpdate={updateUserImage} userImage={userImage} />
        </div>
    </div>
  )
}

export default HeaderDash