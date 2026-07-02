import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { H2 } from '@/components/Typographie';
import aboutDetaille1 from '../assets/aboutDetaille1.webp';
import aboutDetaille2 from '../assets/aboutDetaille2.webp';
import aboutDetaille3 from '../assets/aboutDetaille3.webp';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; 
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
//import langue from "../assets/langue.webp";
import multimedia from "../assets/multimedia.webp";
import informatique from "../assets/informatique.webp";
import { getData } from '@/service/api';
import EquipeCard from '@/components/EquipeCard';
import { motion } from 'framer-motion';
import img1 from '../assets/image1.webp';
import img2 from '../assets/image2.webp';
import img3 from '../assets/image3.webp';
import img4 from '../assets/image4.webp';
import img5 from '../assets/image5.webp';
import img6 from '../assets/image6.webp'; 
import img7 from '../assets/image7.webp';
import img8 from '../assets/image8.webp';
import img9 from '../assets/image9.webp';
import img10 from '../assets/image10.webp';
import { cn } from "@/lib/utils"

/* ---------------- COMPOSANT INDICATEURS ---------------- */
const CarouselDots = ({ api, count, current }) => {
  if (!api || count <= 1) return null;
  
  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => api.scrollTo(i)}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            current === i ? "bg-sky-600 w-6" : "bg-gray-300 w-2"
          )}
        />
      ))}
    </div>
  );
};

function AboutDetaille() {
  const [about, setAbout] = useState([]);
  const [equipe, setEquipe] = useState([]);

  const formations = [
    /*{img: langue, title:"Langues étrangères", desc:"Acquérir une maîtrise linguistique solide et s’ouvrir à de nouvelles perspectives internationales."},*/
    {img: multimedia, title:"Multimédia", desc:"Se former aux métiers créatifs et devenir acteur des innovations du monde moderne."},
    {img: informatique, title:"Informatique (+ maintenance)", desc:"Renforcer son efficacité et sa confiance dans l’usage des outils technologiques."}
  ]

  const [apiFormation, setApiFormation] = useState(null);
  const [currentFormation, setCurrentFormation] = useState(0);


  useEffect(() => {
      if (!apiFormation) return;
      apiFormation.on("select", () => setCurrentFormation(apiFormation.selectedScrollSnap()));
    }, [apiFormation]);

  useEffect(() => {
    const fetchAboutDetaille = async () => {
      try {
        const response = await getData("/about/");
        setAbout(response.data);
      } catch(err) {
        console.log("Erreur :", err);
      }
    };

    const fetchEquipe = async () => {
      try {
        const response = await getData("equipes/");
        setEquipe(response.data);
      } catch (err) {
        console.log("Erreur lors de la récupération de l'équipe : ", err);
      }
    };

    fetchAboutDetaille();
    fetchEquipe();
  }, []);

  const partenaires = [
    { id: 1, name: "Partenaire 1", image: img1, link: "https://www.actioncontrelafaim.org/nos-operations/madagascar/" },
    { id: 2, name: "Partenaire 2", image: img2, link: "https://www.welthungerhilfe.org/what-we-do/countries/madagascar" },
    { id: 3, name: "Partenaire 3", image: img3},
    { id: 4, name: "Partenaire 4", image: img4, link: "https://www.transparency.mg/" },
    { id: 5, name: "Partenaire 5", image: img5, link: "https://mihari-network.org/" },
    { id: 6, name: "Partenaire 6", image: img6, link: "https://www.secours-islamique.org/nos-actions/missions-internationales/don-madagascar" },
    { id: 7, name: "Partenaire 7", image: img7, link: "https://www.facebook.com/ScoreEducation/?locale=fr_FR" },
    { id: 8, name: "Partenaire 8", image: img8, link: "https://www.facebook.com/Ordre.des.journalistes.de.Madagascar" },
    { id: 9, name: "Partenaire 9", image: img9, link: "https://www.facebook.com/jci.toliara/?locale=fr_FR" },
    { id: 10, name: "Partenaire 10", image: img10, link: "https://www.facebook.com/consultingplusmadagascar" },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const fromRigth = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeIn' } }
  };

  const fromLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  return (
    <div className="pt-[100px] py-16 md:py-20 lg:py-28">

      <Helmet>
        <title>STEPIC Madagascar-Tuléar - À propos</title>
        <meta name="description" content="Tout savoir sur STEPIC Madagascar-Tuléar, notre équipe et notre mission." />
        <meta property="og:title" content="STEPIC Madagascar-Tuléar - À propos" />
        <meta property="og:description" content="Tout savoir sur STEPIC Madagascar-Tuléar, notre équipe et notre mission." />
        <meta property="og:image" content="https://www.stepic-mada.com/logo.png" />
        <meta property="og:url" content="https://www.stepic-mada.com/about" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="STEPIC Madagascar-Tuléar - À propos" />
        <meta name="twitter:description" content="Tout savoir sur STEPIC Madagascar-Tuléar, notre équipe et notre mission." />
        <meta name="twitter:image" content="https://www.stepic-mada.com/logo.png" />
      </Helmet>

      {/* -------- Mission -------- */}
      <motion.div className="flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-20 mb-[100px]"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <motion.div 
          className="w-full md:w-[50%] lg:w-[45%] text-justify px-4 text-black"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fromLeft}
          >
          <H2>Nos Objectifs</H2>
          <p className='text-sm sm:text-base leading-relaxed sm:leading-loose mb-4'>
            {about.length > 0 ? (about.find((item) => item.id === 2 ) || {}).contenu : 'chargement...'}
          </p>
        </motion.div>
        <motion.img initial="hidden" whileInView="visible" variants={fromRigth} src={aboutDetaille2} loading='lazy' alt="mission" className="w-[90%] md:w-[400px] lg:w-[450px] xl:w-[500px] hover:scale-105 transition-all duration-300 h-auto rounded-lg"/>
      </motion.div>

      {/* -------- Nos offres -------- */}
      <motion.div className="flex flex-col-reverse md:flex-row justify-center items-center gap-8 lg:gap-20 mb-[100px]"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <motion.img variants={fromLeft} initial="hidden" whileInView="visible" src={aboutDetaille1} loading='lazy' alt="offres" className="w-[90%] md:w-[400px] lg:w-[450px] xl:w-[500px] h-auto rounded-lg hover:scale-105 transition-all duration-300"/>
        <motion.div 
          className="w-full md:w-[50%] lg:w-[45%] text-justify px-4"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fromRigth}>
          <H2>Nos Services</H2>

          {/* ✅ Phrase ajoutée */}
          <p className='text-sm sm:text-base h-auto md:h-[117px] text-black leading-relaxed sm:leading-loose mb-4'>
            Nous concevons et produisons également une large gamme de supports :
          </p>
          
          <Accordion className="w-full rounded-md bg-mauve6" type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className=" text-base sm:text-lg text-black">Spots publicitaires</AccordionTrigger>
              <AccordionContent className='text-sm sm:text-base leading-relaxed sm:leading-loose mb-4 text-black'>
                Frappez fort avec des messages courts et percutants, conçus pour marquer les esprits à la TV, à la radio ou en ligne.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className=" text-base sm:text-lg text-black">Créations graphiques</AccordionTrigger>
              <AccordionContent className='text-sm sm:text-base leading-relaxed sm:leading-loose mb-4 text-black'>
                Donnez vie à vos idées avec des visuels uniques et modernes qui reflètent l’identité de votre marque.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className=" text-base sm:text-lg text-black">Productions audiovisuelles (PAD)</AccordionTrigger>
              <AccordionContent className='text-sm sm:text-base leading-relaxed sm:leading-loose mb-4 text-black'>
                Captez l’attention grâce à des vidéos et contenus audio qui racontent votre histoire et engagent votre public.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </motion.div>

      {/* -------- Formations -------- */}
      <motion.div className="flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-20 mb-[100px]"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <motion.div 
          className="w-full md:w-[50%] lg:w-[45%] text-justify px-4 text-black"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fromLeft}
        >
          <H2>Nos Formations</H2>
          <p className='text-sm sm:text-base leading-relaxed sm:leading-loose mb-4'>Au-delà de nos prestations de communication, nous proposons des formations pratiques et professionnelles dans trois domaines clés :</p>
        </motion.div>
        <div className="w-full md:w-[400px] lg:w-[450px] xl:w-[500px]">  
          <Carousel setApi={apiFormation} className="h-auto px-2 py-3">
            <CarouselContent className="m-auto">
              {formations.map((item, idx) => (
                <CarouselItem key={idx}>
                  <Card className="w-[90%] sm:w-[350px] md:w-[400px] bg-blue-900/70 text-white border border-white/20 shadow-xl shadow-indigo-500/50 px-[15px] py-[20px] m-auto backdrop-blur-lg">
                    <div className="w-[85%] m-auto"><img src={item.img} loading='lazy' alt={item.title}/></div>
                    <CardHeader className="text-gray-900">
                      <CardTitle className="text-center text-lg mb-1.5">{item.title}</CardTitle>
                      <CardDescription className="text-white">{item.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-black cursor-pointer"/>
            <CarouselNext className="text-black cursor-pointer"/>
          </Carousel>
          <CarouselDots api={apiFormation} count={formations.length} current={currentFormation} />
        </div>
      </motion.div>

      {/* -------- Particularité -------- */}
      <motion.div className="flex flex-col-reverse md:flex-row justify-center items-center gap-8 lg:gap-20 mb-[100px]"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <motion.img variants={fromLeft} initial="hidden" whileInView="visible" viewport={{ once: true }} src={aboutDetaille3} loading='lazy' alt="particularité" className="w-[90%] md:w-[400px] lg:w-[450px] xl:w-[500px] h-auto rounded-lg hover:scale-105 transition-all duration-300"/>
        <motion.div className="w-full md:w-[50%] lg:w-[45%] text-justify px-4 text-black" variants={fromRigth} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <H2>Pourquoi nous?</H2>
          <p className='text-sm sm:text-base leading-relaxed sm:leading-loose mb-4'>
            Ce qui fait la différence chez STEPIC, c’est notre capacité à allier expertise technique, créativité et pédagogie, tout en restant à l’écoute des besoins spécifiques de nos clients pour leur offrir des solutions sur mesure et un accompagnement personnalisé.
          </p>
        </motion.div>
      </motion.div>

      {/* -------- Équipe -------- */}
      <motion.div className="mb-[100px] px-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <H2 className="text-center mb-4 text-black">Découvrez notre équipe</H2>
        <p className='text-sm sm:text-base leading-relaxed sm:leading-loose mb-4 mx-auto max-w-3xl text-justify text-black'>
          Une équipe composée de talents passionnés dans les domaines de la communication, du multimédia et de l’informatique. Chaque membre apporte son expertise unique pour offrir des solutions adaptées aux besoins de nos clients.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center max-w-7xl mx-auto">
          {equipe.map((e) => <EquipeCard equipe={e} key={e.id} />)}
        </div>
      </motion.div>

      {/* -------- Partenaires -------- */}
      <motion.div className='min-h-screen px-6 py-16' initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <H2>Nos références</H2>
        <p className='text-sm sm:text-base leading-relaxed sm:leading-loose text-black mb-12 text-center'>
          Des institutions pour lesquelles nous avons réalisé des projets avec succès:
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8'>
          {partenaires.map((item) => (
            <a key={item.id} href={item.link} target="_blank" className='bg-white shadow-md rounded-xl p-6 flex flex-col items-center gap-4 hover:scale-105 transition-all duration-300 border-gray-100'>
              <img src={item.image} alt={item.name} className='w-33 h-33 object-contain'/>
            </a>
          ))}
        </div>
      </motion.div>

    </div>
  );
}

export default AboutDetaille;
