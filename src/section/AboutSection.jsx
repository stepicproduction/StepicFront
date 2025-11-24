import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { H2, P } from '@/components/Typographie'
import aboutResume from '../assets/aboutResume.png'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { getData } from '@/service/api'

// Définition des couleurs de la charte
const PRIMARY_PURPLE = '#6c63ff'
const DARK_PURPLE = '#8a2be2'

function AboutSection() {
    const [about, setAbout] = useState([])
    const [isVisible, setIsVisible] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const response = await getData("/about/")
                setAbout(response.data)
            } catch (err) {
                console.error("Erreur GET :", err)
            }
        }
        fetchAbout()
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        const section = document.getElementById('about')
        if (section) observer.observe(section)

        return () => {
            if (section) observer.unobserve(section)
        }
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    }

    const titleVariants = {
        hidden: { opacity: 0, y: -50, scale: 0.8 },
        visible: {
            opacity: 1, y: 0, scale: 1,
            transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
        }
    }

    const imageVariants = {
        hidden: { opacity: 0, x: -100, scale: 0.8, rotateY: -15 },
        visible: {
            opacity: 1, x: 0, scale: 1, rotateY: 0,
            transition: { duration: 1, ease: [0.23, 1, 0.32, 1] }
        }
    }

    const contentVariants = {
        hidden: { opacity: 0, x: 100, y: 30 },
        visible: {
            opacity: 1, x: 0, y: 0,
            transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
        }
    }

    const textVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.02, delayChildren: 0.3 }
        }
    }

    const letterVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.8 },
        visible: {
            opacity: 1, y: 0, scale: 1,
            transition: { duration: 0.3, ease: "easeOut" }
        }
    }

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: {
            opacity: 1, scale: 1, y: 0,
            transition: { delay: 0.5, duration: 0.6, ease: "easeOut" }
        }
    }

    const animateText = (text) => {
        if (!text) return null
        return text.split('').map((char, index) => (
            <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block"
                style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
            >
                {char}
            </motion.span>
        ))
    }

    return (
        <motion.div
            id="about"
            className="relative py-10 px-4 sm:px-8 md:py-20 md:px-32 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
        >
            {/* Titre animé */}
            <motion.div
                variants={titleVariants}
                className="text-center mb-12 sm:mb-16 md:mb-10 lg:mb-24"
            >
                <H2 className='text-3xl md:text-4xl text-[#6c63ff] leading-1.3 text-center font-semibold mb-[30px] prose prose-[#6c63ff] prose-h2'> 
                    Qui sommes-nous ?
                </H2>
                {/* L'élément de la ligne animée a été supprimé ici */}
            </motion.div>

            {/* Contenu principal */}
            <div className="grid grid-cols-1 min-[950px]:grid-cols-12 gap-6 md:gap-8 place-items-center">

                {/* Conteneur de l'image avec border-radius et effet de bordure dégradée */}
                <motion.div
                    variants={imageVariants}
                    className="relative col-span-12 min-[950px]:col-span-6"
                >
                    {/* Cadre dégradé avec border-radius */}
                    <div className={`p-[3px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-tr from-[${DARK_PURPLE}] to-[${PRIMARY_PURPLE}]`}>
                        <motion.div
                            className="w-full h-full rounded-[calc(1.5rem-3px)] overflow-hidden bg-white" // arrondi intérieur pour laisser le dégradé visible
                            whileHover={{
                                scale: 1.02,
                                rotateY: 2,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <img
                                src={aboutResume}
                                alt="À propos"
                                className="w-full h-auto object-cover"
                                loading='lazy'
                            />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Contenu texte animé */}
                <motion.div
                    variants={contentVariants}
                    className="col-span-12 min-[950px]:col-span-6 md:items-center"
                >
                    <motion.div
                        variants={textVariants}
                        className="mb-6 sm:mb-8 md:mb-20"
                    >
                        <p className='text-base h-auto md:h-[117px] text-black leading-relaxed mb-[15px]'>
                            {about.length > 0 ? (
                                animateText(
                                    (about.find((item) => item.id === 1) || {}).contenu || "Contenu introuvable"
                                )
                            ) : (
                                <motion.span
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-gray-800"
                                >
                                    Chargement...
                                </motion.span>
                            )}
                        </p>
                    </motion.div>

                    {/* Bouton animé */}
                    <motion.div variants={buttonVariants}>
                        <Button
                           variant="ghost"
                            size="default"
                            className="flex items-center justify-center gap-2 px-6 py-2 rounded-full text-[#0B1D5D] border border-[#0B1D5D] hover:bg-[#0B1D5D] hover:text-white font-semibold shadow-lg transition-all duration-300 cursor-pointer 
                            h-10 w-40 md:h-12 md:w-48" 
                            onClick={() => navigate('/about')}
                            whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Lire plus
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default AboutSection