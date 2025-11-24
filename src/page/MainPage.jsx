import React from 'react'
import Navbar from '@/components/Navbar';
import FooterSection from '@/section/FooterSection';
import { Outlet } from 'react-router-dom';

function MainPage() {
  return (
    <div className='min-h-[100vh]'>
      <Navbar/>
      <div>
        <Outlet/>
      </div>
      <FooterSection/>
    </div>
  )
}

export default MainPage