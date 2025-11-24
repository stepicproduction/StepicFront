import React from 'react'
import AppSide from '@/components/AppSide'
import { SidebarProvider } from '@/components/ui/sidebar'
import HeaderDash from '@/components/HeaderDash'
import { Outlet } from 'react-router-dom'

function DashboardPage() {
  return (
    <div>
      <SidebarProvider>
        <AppSide />
        <div className='w-full flex flex-col'>
          <HeaderDash />
          <main className='bg-gray-100 min-h-[100vh] text-black px-4 py-6'>
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default DashboardPage