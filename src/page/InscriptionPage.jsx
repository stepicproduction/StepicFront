import React, { useState, useEffect } from "react"; // Importe useEffect
import { Helmet } from "react-helmet";
import { H2 } from "@/components/Typographie";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Step1Schema, Step2Schema, Step3Schema, GlobalSchema } from "./inscription_form/schema"; 
import { FaCheckCircle } from 'react-icons/fa';
import Confetti from 'react-confetti'; // Importe le composant Confetti
import fin from "../assets/fin.webp"
import { useLocation } from 'react-router-dom';
import { createData } from "@/service/api";

const Step1 = React.lazy(() => import("./inscription_form/Step1"));
const Step2 = React.lazy(() => import("./inscription_form/Step2"));
const Step3 = React.lazy(() => import("./inscription_form/Step3"));
const Step4 = React.lazy(() => import("./inscription_form/Step4"));

// Hook pour obtenir la taille de la fenêtre (utile pour Confetti)
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Appeler une fois au montage pour obtenir les dimensions initiales
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}


function CommandePage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [showConfetti, setShowConfetti] = useState(false); // Nouveau state pour l'animation
    const { width, height } = useWindowSize(); // Utilise le hook pour la taille de la fenêtre

    const location = useLocation();
    const preselectedCategoryId = location.state?.preselectedCategoryId;

    const initialDefaultValues = {
        ...formData,
        // Si un ID est passé par navigation, on l'utilise
        categorie: preselectedCategoryId || formData.categorie || "", 
    };

    const resolverSchema = (() => {
        switch (step) {
            case 1: return Step1Schema;
            case 2: return Step2Schema;
            case 3: return Step3Schema;
            case 4: return GlobalSchema; 
            default: return z.object({}); 
        }
    })();
    
    const formMethods = useForm({
        resolver: zodResolver(resolverSchema), 
        defaultValues: initialDefaultValues, 
        mode: 'onBlur', 
    }); 

    const { register, handleSubmit, watch,  formState: { errors, isSubmitting }, getValues, setValue,  trigger } = formMethods;

    const handleNext = async () => {
        const isValidStep = await trigger(); 
        if (isValidStep) {
            setFormData(prev => ({ ...prev, ...getValues() }));
            setStep(prev => prev + 1); 
        }
    };
    
    const handlePrevious = () => {
        setFormData(prev => ({ ...prev, ...getValues() })); 
        setStep(prev => prev - 1);
    };
    
    const onSubmit = async (data) => {
        const finalFormData = { ...formData, ...getValues() };
        
        console.log("🚀 Données Finales Validées :", finalFormData);
        //alert("Formulaire Multipart Envoyé ! (Vérifiez la console)");
        setStep(5); // Passage à l'étape de confirmation finale
        setShowConfetti(true); // Active l'animation de confettis !
        await createData("/inscriptions/", finalFormData)

        // Optionnel : Désactiver les confettis après quelques secondes
        setTimeout(() => {
            setShowConfetti(false);
        }, 8000); // 8 secondes
    };
    
    const renderStep = () => {
        const commonProps = { register, errors, isSubmitting, setValue, watch };

        switch (step) {
            case 1:
                return (<Step1 {...commonProps} handleNext={handleNext} />);
            case 2:
                return (<Step2 {...commonProps} handlePrevious={handlePrevious} handleNext={handleNext} />);
            case 3: 
                return (<Step3 {...commonProps} watch={watch} handlePrevious={handlePrevious} handleNext={handleNext} />);
            case 4: 
                return (
                    <Step4 
                        formData={{ ...formData, ...getValues() }} 
                        handlePrevious={handlePrevious} 
                        handleSubmit={handleSubmit} 
                        isSubmitting={isSubmitting}
                    />
                );
            case 5: // Nouvelle étape de confirmation finale
                 return (
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 min-h-[60vh]">
                
                        {/* Contenu principal */}
                        <div className="w-full md:w-[50%] flex flex-col items-center md:items-start text-left p-8 bg-green-100 rounded-lg">
                            <FaCheckCircle className="text-6xl text-green-500 mx-auto md:mx-0 mb-4" />
                            <h2 className="text-2xl font-bold text-green-800 text-center md:text-left">Inscription Terminée !</h2>
                            <p className="mt-2 text-gray-700 text-center md:text-left">
                                Nous avons bien reçu votre inscription. Un email de confirmation vous sera envoyé.
                            </p>
                
                            {/* Bouton */}
                            <button 
                                onClick={() => { setStep(1); setFormData({}); setShowConfetti(false); }} 
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold 
                                           bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] hover:from-[#6c63ff] hover:to-[#8a2be2] 
                                           shadow-lg transition-colors duration-300 cursor-pointer w-full sm:w-auto mt-4"
                            >
                                Nouvelle inscription
                            </button>
                        </div>

    {/* Image visible uniquement desktop/tablette */}
    <div className="hidden md:flex w-full md:w-[50%] justify-center">
      <img src={fin} alt="Image de confirmation" className="max-w-full h-auto" />
    </div>

  </div>
);

            default: // Au cas où step dépasse 5, ce qui ne devrait pas arriver ici
                return null;
        }
    };  
    
    return (
        <div className="pt-[150px] flex flex-col gap-6 pb-7 text-black relative min-h-[80vh]"> {/* Ajoute 'relative' pour le positionnement du confetti */}

            <Helmet>
                <title>STEPIC Madagascar - Inscriptions</title>
                <meta name="description" content="Rejoignez nos programmes de formation et donnez un coup d’accélérateur à votre carrière." />
                <meta property="og:title" content="STEPIC Madagascar - Inscriptions" />
                <meta property="og:description" content="Rejoignez nos programmes de formation et donnez un coup d’accélérateur à votre carrière." />
                <meta property="og:image" content="https://www.stepic-mada.com/logo.png" />
                <meta property="og:url" content="https://www.stepic-mada.com/inscription" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="STEPIC Madagascar - Inscriptions" />
                <meta name="twitter:description" content="Rejoignez nos programmes de formation et donnez un coup d’accélérateur à votre carrière." />
                <meta name="twitter:image" content="https://www.stepic-mada.com/logo.png" />
            </Helmet>       

            {/* L'animation de confettis s'affiche si showConfetti est true */}
            {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} gravity={0.15} />}

            <H2>Ta réussite commence par une inscription.</H2>
            <form onSubmit={handleSubmit(onSubmit)} className="form mx-auto p-6 sm:p-8 bg-white shadow-xl rounded-lg w-full max-w-4xl flex flex-col gap-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-600">
                    Progression : Etape {step <= 4 ? `${step}/4` : 'Terminé'}
                </h3>
                <hr className="mb-6"/>
                {renderStep()}
            </form>
        </div>
    );
}

export default CommandePage;