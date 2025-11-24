import React from "react";
import { createBrowserRouter, ScrollRestoration  } from "react-router-dom";
import MainPage from "@/page/MainPage";
import LoginPage from "@/page/LoginPage";
import DashboardPage from "@/page/DashboardPage";
import HomePage from "@/page/HomePage";
import AboutDetaille from "@/page/AboutDetaille";
import OffreDetaille from "@/page/OffreDetaille"
import TemoinDetaille from "@/page/TemoinDetaille"
import InscriptionPage from "@/page/InscriptionPage";
import CommandePage from "@/page/CommandePage";
import PresseActu from "@/page/PresseActu";
import DashHome from "@/components/Dash/DashHome";
import DashUser from "@/components/Dash/DashUser";
import DashService from "@/components/Dash/DashService";
import DashRegister from "@/components/Dash/DashRegister";
import DashCommand from "@/components/Dash/DashCommand";
import DashProject from "@/components/Dash/DashProject";
import DashShow from "@/components/Dash/DashShow";
import DashMessage from "@/components/Dash/DashMessage";
import DashTeam from "@/components/Dash/DashTeam";
import DashAbout from "@/components/Dash/DashAbout";
import DashTemoin from "@/components/Dash/DashTemoin";
import DashActu from "@/components/Dash/DashActu";
import DashCategorie from "@/components/Dash/DashCategorie";
import DashPresse from "@/components/Dash/DashPresse";
import ContactPage from "@/page/ContactPage";
import ProtectedRoute from "@/service/ProtectedRoute";
import StrategiePage from "@/page/offrePage/StrategiePage";
import IdentitePage from "@/page/offrePage/IdentitePage";
import CommunicationPage from "@/page/offrePage/CommunicationPage";
import ProductionPage from "@/page/offrePage/ProductionPage";
import PublicitePage from "@/page/offrePage/PublicitePage";
import EvenementielPage from "@/page/offrePage/EvenementielPage";
import FormationPage from "@/page/offrePage/FormationPage";

const router = createBrowserRouter([
    {
        path : "/",
        element :<>
                    <ScrollRestoration /> 
                    <MainPage />
                </> ,
        children : [
            {
                path : "",
                element : <HomePage/>
            },
            {
                path : "about",
                element : <AboutDetaille/>
            },
            {
                path : "temoin",
                element : <TemoinDetaille/>
            },
            {
                path : "offre",
                element : <OffreDetaille/>,
                children: [
                    {
                        path : "",
                        element : <StrategiePage />
                    },
                    {
                        path : "offreIdentite",
                        element : <IdentitePage />
                    },
                    {
                        path : "offreCommunication",
                        element : <CommunicationPage />
                    },
                    {
                        path : "offreProduction",
                        element : <ProductionPage />
                    },
                    {
                        path : "offrePublicite",
                        element : <PublicitePage />
                    },
                    {
                        path : "offreEvenementiel",
                        element : <EvenementielPage />
                    },
                    {
                        path : "offreFormation",
                        element : <FormationPage />
                    },
                ]
            },
            {
                path : "inscription",
                element : <InscriptionPage/>
            },
            {
                path : "commande",
                element : <CommandePage/>
            },
            {
                path : "contact",
                element : <ContactPage/>
            },
            {
                path : "presse_actu",
                element : <PresseActu/>
            },
        ]
    },
    {
        path : "/login",
        element : <LoginPage/>
    },
    {
        path : "/dashboard",
        element : <ProtectedRoute />,
        children: [
            {
                path : "",
                element : <DashboardPage />,
                children : [
                    {
                        path : "",
                        element : <DashHome />,
                    },
                    {
                        path : "dashUtilisateur",
                        element : <DashUser />,
                    },
                    {
                        path : "dashInscription",
                        element : <DashRegister />,
                    },
                    {
                        path : "dashCommande",
                        element : <DashCommand />,
                    },
                    {
                        path : "dashCategorie",
                        element : <DashCategorie />,
                    },
                    {
                        path : "dashOffre",
                        element : <DashService />,
                    },
                    {
                        path : "dashProjet",
                        element : <DashProject />,
                    },
                    {
                        path : "dashVideo",
                        element : <DashShow />,
                    },
                    {
                        path : "dashMessage",
                        element : <DashMessage />,
                    },
                    {
                        path : "dashAbout",
                        element : <DashAbout />,
                    },
                    {
                        path : "dashTemoin",
                        element : <DashTemoin />,
                    },
                    {
                        path : "dashActualite",
                        element : <DashActu />,
                    },
                    {
                        path : "dashEquipe",
                        element : <DashTeam />,
                    },
                    {
                        path : "dashPresse",
                        element : <DashPresse />,
                    },
                ]
            },
        ]
    }
])

export default router