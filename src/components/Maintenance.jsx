import React from 'react'
import logo from '@/assets/logo_stepic2.webp'
import { Loader } from 'lucide-react'
import { Typewriter } from "react-simple-typewriter";

const Maintenance = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white text-center px-4">
      {/* Logo */}
      <img src={logo} alt="Logo" className="w-32 mb-8 animate-pulse" />

      {/* Loader */}
      {/* <div className="w-12 h-12 border-4 border-white border-t-blue-400 rounded-full animate-spin mb-6"></div> */}
      <span className='animate-spin mb-8'><Loader size={60} /></span>

      {/* Texte */}
      <p className="text-lg sm:text-xl md:text-2xl opacity-80">
        
        <Typewriter
          words={["Nous vous donnons un rendez-vous à très bientôt  🚀", "We look forward to seeing you very soon 🚀", "Wir freuen uns darauf, Sie sehr bald zu sehen 🚀"]}
          loop={0}
          cursor
          cursorStyle="|"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1000}
        />
      </p>
    </div>
  )
}

export default Maintenance