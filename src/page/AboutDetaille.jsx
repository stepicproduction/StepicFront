import React, { useState, useEffect } from 'react'
import { P, H2 } from '@/components/Typographie'
import aboutDetaille1 from '../assets/aboutDetaille1.webp'
import aboutDetaille2 from '../assets/aboutDetaille2.webp'
import aboutDetaille3 from '../assets/aboutDetaille3.webp'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion" 
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import langue from "../assets/langue.webp"
import multimedia from "../assets/multimedia.webp"
import informatique from "../assets/informatique.webp"
import { getData } from '@/service/api'
import EquipeCard from '@/components/EquipeCard'

function AboutDetaille() {
  const [about, setAbout] = useState([]);
  const [equipe, setEquipe] = useState([])

  const fetchAboutDetaille = async () => {
    try {
      const response = await getData("/about/")
      setAbout(response.data)
    } catch(err) {
      console.log("Erreur :", err);
    }
  }

  const fetchEquipe = async () => {
    try {
      const response = await getData("equipes/")
      setEquipe(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération de l'équipe : ", err)
    }
  }

  useEffect(() =>{
    fetchAboutDetaille()
    fetchEquipe()
  }, [])

  return (
    <div className="pt-[100px] py-16 md:py-20 lg:py-28">

      {/* -------- Mission -------- */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-40 mb-[100px]">
        {/* Ajout de text-black ici si le composant <P> n'a pas de couleur par défaut */}
        <div className="w-full md:w-[50%] lg:w-[35%] text-justify px-4 text-black">
          <H2>Notre Mission</H2>
          <P>{about.length > 0 ? (about.find((item) => item.id === 2 ) || {}).contenu : 'chargement...'}</P>
        </div>
        <img src={aboutDetaille2} loading='lazy' alt="mission" className="w-[90%] md:w-[400px] lg:w-[500px] h-auto rounded-lg"/>
      </div>

      {/* -------- Nos offres -------- */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-40 mb-[100px]">
        <img src={aboutDetaille1} loading='lazy' alt="offres" className="w-[90%] md:w-[400px] lg:w-[500px] h-auto rounded-lg"/>
        <div className="w-full md:w-[50%] lg:w-[35%] text-justify px-4">
          <H2>Nos Services</H2>
          {/* Ajout de text-black ici si le composant <P> n'a pas de couleur par défaut */}
          <p className="text-black text-base md:text-lg leading-1.7">Nous concevons et produisons également une large gamme de supports :</p>
          <Accordion className="w-full rounded-md bg-mauve6 shadow-[0_2px_10px] shadow-black/5"
            type="single" collapsible>
            <AccordionItem value="item-1">
              {/* Ajout de text-black */}
              <AccordionTrigger className=" text-[18px] text-black">Spots publicitaires</AccordionTrigger>
              {/* Ajout de text-black */}
              <AccordionContent className=" text-[16px] md:text-[18px] text-black">
                Frappez fort avec des messages courts et percutants, conçus pour marquer les esprits à la TV, à la radio ou en ligne.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              {/* Ajout de text-black */}
              <AccordionTrigger className=" text-[18px] text-black">Créations graphiques</AccordionTrigger>
              {/* Ajout de text-black */}
              <AccordionContent className=" text-[16px] md:text-[18px] text-black">
                Donnez vie à vos idées avec des visuels uniques et modernes qui reflètent l’identité de votre marque.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              {/* Ajout de text-black */}
              <AccordionTrigger className=" text-[18px] text-black">Productions audiovisuelles (PAD)</AccordionTrigger>
              {/* Ajout de text-black */}
              <AccordionContent className=" text-[16px] md:text-[18px] text-black">
                Captez l’attention grâce à des vidéos et contenus audio qui racontent votre histoire et engagent votre public.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* -------- Formations -------- */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-40 mb-[100px]">
        {/* Ajout de text-black ici si le composant <P> n'a pas de couleur par défaut */}
        <div className="w-full md:w-[50%] lg:w-[35%] text-justify px-4 text-black">
          <H2>Nos Formations</H2>
          <P>Au-delà de nos prestations de communication, nous proposons des formations pratiques et professionnelles dans trois domaines clés :</P>
        </div>
        <Carousel className="w-full md:w-[400px] lg:w-[500px] h-auto px-2 py-3">
          <CarouselContent className="m-auto">
            <CarouselItem>
              <Card className="w-[90%] sm:w-[350px] md:w-[400px] 
                            bg-blue-900/70 text-white border border-white/20 
                            shadow-xl shadow-indigo-500/50 
                            px-[15px] py-[20px] m-auto backdrop-blur-lg">
                <div className="w-[85%] m-auto">
                  <img src={langue} loading='lazy' alt="langue"/>
                </div>
                {/* Ajout de text-black dans CardHeader et text-gray-700 dans CardDescription pour lisibilité sur fond de carte blanche */}
                <CardHeader className="text-black">
                  <CardTitle className="text-center">Langues étrangères</CardTitle>
                  <CardDescription className="text-white">
                    Acquérir une maîtrise linguistique solide et s’ouvrir à de nouvelles perspectives internationales.
                  </CardDescription>
                </CardHeader>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="w-[90%] sm:w-[350px] md:w-[400px] 
                            bg-blue-900/70 text-white border border-white/20 
                            shadow-xl shadow-indigo-500/50 
                            px-[15px] py-[20px] m-auto backdrop-blur-lg">
                <div className="w-[85%] m-auto">
                  <img src={multimedia} loading='lazy' alt="multimedia"/>
                </div>
                 {/* Ajout de text-black dans CardHeader et text-gray-700 dans CardDescription pour lisibilité sur fond de carte blanche */}
                <CardHeader className="text-black">
                  <CardTitle className="text-center">Multimédia</CardTitle>
                  <CardDescription className="text-white">
                    Se former aux métiers créatifs et devenir acteur des innovations du monde moderne.
                  </CardDescription>
                </CardHeader>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="w-[90%] sm:w-[350px] md:w-[400px] 
                            bg-blue-900/70 text-white border border-white/20 
                            shadow-xl shadow-indigo-500/50 
                            px-[15px] py-[20px] m-auto backdrop-blur-lg">
                <div className="w-[85%] m-auto">
                  <img src={informatique} alt="informatique"/>
                </div>
                 {/* Ajout de text-black dans CardHeader et text-gray-700 dans CardDescription pour lisibilité sur fond de carte blanche */}
                <CardHeader className="text-black">
                  <CardTitle className="text-center">Informatique (+ maintenance)</CardTitle>
                  <CardDescription className="text-white">
                    Renforcer son efficacité et sa confiance dans l’usage des outils technologiques.
                  </CardDescription>
                </CardHeader>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="text-black cursor-pointer"/>
          <CarouselNext className="text-black cursor-pointer"/>
        </Carousel>
      </div>

      {/* -------- Particularité -------- */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-40 mb-[100px]">
        <img src={aboutDetaille3} loading='lazy' alt="particularité" className="w-[90%] md:w-[400px] lg:w-[500px] h-auto rounded-lg"/>
        <div className="w-full md:w-[50%] lg:w-[35%] text-justify px-4">
          {/* Ajout de text-black à H2 */}
          <H2 className="text-black">Pourquoi nous?</H2>
          {/* Ajout de text-black à P */}
          <p className="text-black text-base md:text-lg leading-1.7">
            Ce qui fait la différence chez STEPIC, c’est notre capacité à allier expertise technique, créativité et pédagogie, tout en restant à l’écoute des besoins spécifiques de nos clients pour leur offrir des solutions sur mesure et un accompagnement personnalisé.
          </p>
        </div>
      </div>

      {/* -------- Équipe -------- */}
      <div className="mb-[100px] px-4">
        {/* Ajout de text-black à H2 */}
        <H2 className="text-center mb-4 text-black">Découvrez notre équipe</H2>
        {/* Ajout de text-black à P */}
        <p className="text-center mb-15 text-black text-base md:text-lg leading-1.7">
          Une équipe composée de talents passionnés dans les domaines de la communication, du multimédia et de l’informatique. Chaque membre apporte son expertise unique pour offrir des solutions adaptées aux besoins de nos clients.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 
            justify-items-center max-w-7xl mx-auto">
          {equipe.map((e) => (
            <EquipeCard equipe={e} key={e.id} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AboutDetaille