import React, { lazy, Suspense } from "react";
import { createBrowserRouter, ScrollRestoration  } from "react-router-dom";
const MainPage = lazy(() => import("@/page/MainPage"))
const LoginPage = lazy(() => import("@/page/LoginPage"))
const DashboardPage = lazy(() => import("@/page/DashboardPage"))
const HomePage = lazy(() => import("@/page/HomePage"))
const AboutDetaille = lazy(() => import("@/page/AboutDetaille"))
const OffreDetaille = lazy(() => import("@/page/OffreDetaille"))
const TemoinDetaille = lazy(() => import("@/page/TemoinDetaille"))
const InscriptionPage = lazy(() => import("@/page/InscriptionPage"))
const CommandePage = lazy(() => import("@/page/CommandePage"))
const PresseActu = lazy(() => import("@/page/PresseActu"))
const DashHome = lazy(() => import("@/components/Dash/DashHome"))
const DashUser = lazy(() => import("@/components/Dash/DashUser"))
const DashService = lazy(() => import("@/components/Dash/DashService"))
const DashRegister = lazy(() => import("@/components/Dash/DashRegister"))
const DashCommand = lazy(() => import("@/components/Dash/DashCommand"))
const DashShow = lazy(() => import("@/components/Dash/DashShow"))
const DashMessage = lazy(() => import("@/components/Dash/DashMessage"))
const DashTeam = lazy(() => import("@/components/Dash/DashTeam"))
const DashAbout = lazy(() => import("@/components/Dash/DashAbout"))
const DashTemoin = lazy(() => import("@/components/Dash/DashTemoin"))
const DashActu = lazy(() => import("@/components/Dash/DashActu"))
const DashCategorie = lazy(() => import("@/components/Dash/DashCategorie"))
const DashProject = lazy(() => import("@/components/Dash/DashProject"))
const DashPresse = lazy(() => import("@/components/Dash/DashPresse"))
const ContactPage = lazy(() => import("@/page/ContactPage"))
const ActuDetaille = lazy(() => import("@/page/ActuDetaille"))
const ActuEntrepriseDetaille = lazy(() => import("@/page/ActuEntrepriseDetaille"))
const ProtectedRoute = lazy(() => import("@/service/ProtectedRoute"))
const StrategiePage = lazy(() => import("@/page/offrePage/StrategiePage"))
const IdentitePage = lazy(() => import("@/page/offrePage/IdentitePage"))
const CommunicationPage = lazy(() => import("@/page/offrePage/CommunicationPage"))
const ProductionPage = lazy(() => import("@/page/offrePage/ProductionPage"))
const PublicitePage = lazy(() => import("@/page/offrePage/PublicitePage"))
const EvenementielPage = lazy(() => import("@/page/offrePage/EvenementielPage"))
const FormationPage = lazy(() => import("@/page/offrePage/FormationPage"))



const Loader = () => <div className="h-screen flex items-center justify-center">Chargement...</div>;

const router = createBrowserRouter([
    {
        path : "/",
       element: (
            <Suspense fallback={<Loader />}> 
                <ScrollRestoration /> 
                <MainPage />
            </Suspense>
        ),
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
                element : 
                            <OffreDetaille />,
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
            {
                path : "actu_detaille/:id",
                element : <ActuDetaille/>
            },
            {
                path : "actu_entreprise_detaille/:id",
                element : <ActuEntrepriseDetaille/>
            },

        ]
    },
    {
        path : "/login",
        element : <LoginPage/>
    },
    {
        path : "/dashboard",
       element: (
            <Suspense fallback={<Loader />}>
                <ProtectedRoute />
            </Suspense>
        ),
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