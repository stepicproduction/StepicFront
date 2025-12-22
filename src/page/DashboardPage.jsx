import React from 'react'
import AppSide from '@/components/AppSide'
import { SidebarProvider } from '@/components/ui/sidebar'
import HeaderDash from '@/components/HeaderDash'
import { Outlet } from 'react-router-dom'

function DashboardPage() {
  return (
    // On s'assure que le conteneur prend toute la largeur sans overflow horizontal parasite
    <div className="relative flex min-h-screen w-full overflow-hidden">
      <SidebarProvider>
        <AppSide />
        {/* On ajoute une transition sur la marge/largeur pour accompagner la sidebar */}
        <div className='flex flex-col flex-1 min-w-0 transition-[width,margin] duration-300 ease-in-out'>
          <HeaderDash />
          <main className='bg-gray-100 flex-1 text-black px-4 py-6 overflow-y-auto'>
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default DashboardPage