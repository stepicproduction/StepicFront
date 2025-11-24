import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup,
        SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarHeader
 } from './ui/sidebar'

import { Link } from 'react-router-dom'
import logo from "../assets/logo.webp"

import { 
    LayoutDashboard, ShoppingCart, UserPlus,
    ClipboardList, Newspaper, Settings, Briefcase,
    FolderKanban, Film, Video, User, Users,
    Info, MessagesSquare, Quote, Mail, LogOut, Tags,
    Notebook
 } from 'lucide-react'

import { useAuth } from '@/service/AuthContext'

function AppSide() {

    const { role } = useAuth()

    const items = [
        {titre : "Dashboard", url : "/dashboard", icon : LayoutDashboard, roles: ['admin', 'employe'] },
        {titre : "Utilisateurs", url : "/dashboard/dashUtilisateur", icon : User, roles: ['admin'] },
        {titre : "Inscriptions", url : "/dashboard/dashInscription", icon : UserPlus, roles: ['admin', 'employe'] },
        {titre : "Commandes", url : "/dashboard/dashCommande", icon : ShoppingCart, roles: ['admin', 'employe'] },
        {titre : "Catégories", url : "/dashboard/dashCategorie", icon : Tags, roles: ['admin', 'employe'] },
        {titre : "Services", url : "/dashboard/dashOffre", icon : Briefcase, roles: ['admin', 'employe'] },
        {titre : "Projets", url : "/dashboard/dashProjet", icon : FolderKanban, roles: ['admin', 'employe'] },
        {titre : "Vidéo", url : "/dashboard/dashVideo", icon : Video, roles: ['admin', 'employe']},
        {titre : "Messages", url : "/dashboard/dashMessage", icon : Mail, roles: ['admin', 'employe'] },
        {titre : "Equipes", url : "/dashboard/dashEquipe", icon : Users, roles: ['admin', 'employe'] },
        {titre : "A propos", url : "/dashboard/dashAbout", icon : Info, roles: ['admin', 'employe'] },
        {titre : "Témoignages", url : "/dashboard/dashTemoin", icon : MessagesSquare, roles: ['admin', 'employe'] },
        {titre : "Actualités", url : "/dashboard/dashActualite", icon : Notebook, roles: ['admin', 'employe'] },
        {titre : "Presse", url : "/dashboard/dashPresse", icon : Newspaper, roles: ['admin', 'employe'] },
    ]

     const filteredItems = role ? items.filter(item => item.roles.includes(role)) : [];

    console.log("Role:", role);
    console.log("Menu items:", filteredItems);

  return (
    <div>

            <Sidebar>
                <SidebarHeader>
                    <div>
                        <img src={logo} alt=""/>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        {/* <SidebarGroupLabel>
                        </SidebarGroupLabel> */}
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {filteredItems.map((item) => (
                                    <SidebarMenuItem key={item.titre}>
                                        <SidebarMenuButton className="mt-[8px] text-gray-900 h-[40px] cursor-pointer font-bold hover:bg-black hover:text-white hover:font-medium">
                                            <Link to={item.url} className='flex items-center gap-4'>
                                                <item.icon size="18" />
                                                {item.titre}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
    </div>
  )
}

export default AppSide