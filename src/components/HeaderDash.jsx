import React, { useState, useEffect } from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { useAuth } from '@/service/AuthContext'
import { UserRound, LogOut, Edit, Edit2Icon, Calendar1Icon } from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger, 
} from './ui/dropdown-menu'
import { useNavigate, useLocation } from 'react-router-dom'
import ModifModalPassword from './Dash/Modals/mdp/ModifModalPassword'
import ModifModalImage from './Dash/Modals/mdp/ModifModalImage'
import { createData, patchFormData } from '@/service/api'

function HeaderDash() {
  const { username, role, userImage, logout, userEmail, userId, updateUserImage: updateContextImage } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [currentTime, setCurrentTime] = useState(new Date())

  const getPageTitle = (pathname) => {
    const pathSegment = pathname.split('/')[2] || ''

    switch (pathSegment) {
      case '':
        return 'Tableau de bord';
      case 'dashUtilisateur':
        return 'Utilisateurs';
      case 'dashInscription':
        return 'Inscriptions';
      case 'dashCommande':
        return 'Commandes';
      case 'dashCategorie':
        return 'Catégories';
      case 'dashOffre':
        return 'Offres';
      case 'dashProjet':
        return 'Projets';
      case 'dashVideo':
        return 'Showreels';
      case 'dashAbout':
        return 'A Propos';
      case 'dashTemoin':
        return 'Témoignages';
      case 'dashActualite':
        return 'Actualités';
      case 'dashEquipe':
        return 'Equipes';
      case 'dashPresse':
        return 'Presses';
      case 'dashMessage':
        return 'Messages';
    }
  }

  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    const updateTime = () => {

      setCurrentTime(new Date())
    }

    const timerId = setInterval(updateTime, 1000)

    return () => clearInterval(timerId)
  }, [])

  const formatTimeManual = (date) => {
    // 1. Récupère le nom du jour en minuscules
    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' }).toUpperCase();
    
    // 2. Récupère les autres éléments
    const dayOfMonth = date.toLocaleDateString('fr-FR', { day: 'numeric' });
    const monthName = date.toLocaleDateString('fr-FR', { month: 'long' });
    const year = date.toLocaleDateString('fr-FR', { year: 'numeric' });
    
    const time = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // S'assure d'avoir le format 24h
    });

    return `${dayName}, ${dayOfMonth} ${monthName} ${year} - ${time}`;
  };

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
       <div className='flex items-center gap-4'>
        <SidebarTrigger className="border-none hover:bg-white"/>
        <span className='text-gray-500'>Dashboard /</span><span className='font-semibold'>{pageTitle}</span>
      </div>

        <div className='flex gap-2'> 
          <Calendar1Icon size={20} />
          <span>{formatTimeManual(currentTime)}</span>
        </div>

        <div className='flex justify-between gap-4 items-center'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className='h-10 w-10 rounded-full flex items-center justify-center'>
                <img src={imgProfil} className='h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm cursor-pointer'/>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-xs text-center px-8 py-4 bg-white text-gray-400'>
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

              <DropdownMenuItem className='mb-2 cursor-pointer' onSelect={handleLogOut}>
                <LogOut className="mr-2 h-4 w-4"/>
                <span>Déconnexion</span>
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