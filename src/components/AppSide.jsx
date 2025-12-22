import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from './ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { 
  LayoutDashboard, ShoppingCart, UserPlus, Newspaper, Briefcase, 
  FolderKanban, Video, User, Users, Info, MessagesSquare, 
  Mail, Tags, Notebook, ChevronDown 
} from 'lucide-react'
import { useAuth } from '@/service/AuthContext'
import { cn } from '@/lib/utils'
import logo from "../assets/logo.webp"

// 1. On sort la config à l'extérieur pour éviter de la recréer à chaque render
const MENU_GROUPS = [
  {
    label: "Général",
    roles: ['admin', 'employe'],
    items: [{ titre: "Dashboard", url: "/dashboard", icon: LayoutDashboard }]
  },
  {
    label: "Administration",
    roles: ['admin'],
    items: [
      { titre: "Utilisateurs", url: "/dashboard/dashUtilisateur", icon: User },
      { titre: "Inscriptions", url: "/dashboard/dashInscription", icon: UserPlus }
    ]
  },
  {
    label: "Business",
    roles: ['admin', 'employe'],
    items: [
      { titre: "Commandes", url: "/dashboard/dashCommande", icon: ShoppingCart },
      { titre: "Catégories", url: "/dashboard/dashCategorie", icon: Tags },
      { titre: "Services", url: "/dashboard/dashOffre", icon: Briefcase },
      { titre: "Projets", url: "/dashboard/dashProjet", icon: FolderKanban }
    ]
  },
  {
    label: "Contenus",
    roles: ['admin', 'employe'],
    items: [
      { titre: "Vidéo", url: "/dashboard/dashVideo", icon: Video },
      { titre: "Actualités", url: "/dashboard/dashActualite", icon: Notebook },
      { titre: "Presse", url: "/dashboard/dashPresse", icon: Newspaper },
      { titre: "Témoignages", url: "/dashboard/dashTemoin", icon: MessagesSquare },
      { titre: "À propos", url: "/dashboard/dashAbout", icon: Info }
    ]
  },
  {
    label: "Communication",
    roles: ['admin', 'employe'],
    items: [
      { titre: "Messages", url: "/dashboard/dashMessage", icon: Mail },
      { titre: "Équipes", url: "/dashboard/dashEquipe", icon: Users }
    ]
  }
];

function AppSide() {
  const { role } = useAuth()
  const location = useLocation()

  // 2. Filtrage mémoïsé : on ne recalcule les accès que si le rôle change
  const filteredGroups = useMemo(() => {
    return MENU_GROUPS.filter(group => role && group.roles.includes(role));
  }, [role]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center py-4">
        <img 
          src={logo} 
          alt="logo" 
          className="h-8 transition-all group-data-[collapsible=icon]:h-6" 
        />
      </SidebarHeader>

      <SidebarContent>
        {filteredGroups.map((group) => (
          <Collapsible key={group.label} className="group/collapsible" defaultOpen>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel
                  className="flex cursor-pointer items-center text-gray-800 justify-between transition-colors hover:text-black group-data-[collapsible=icon]:justify-center"
                >
                  <span className="group-data-[collapsible=icon]:hidden">{group.label}</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>

              <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.url;
                      return (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton
                            asChild
                            tooltip={item.titre} // Optionnel: montre le texte au survol si réduit
                            className={cn(
                              "h-10 transition-colors",
                              isActive ? "bg-black text-white hover:bg-black/90 hover:text-white" : "text-black hover:bg-gray-100"
                            )}
                          >
                            <Link to={item.url} className="flex items-center gap-3">
                              <item.icon size={18} className={cn(isActive ? "text-white" : "text-gray-600")} />
                              <span className="group-data-[collapsible=icon]:hidden">
                                {item.titre}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

export default React.memo(AppSide); // 3. Évite de re-rendre la sidebar si le parent change (ex: horloge du Header)