import './index.css'
import router from './routes/AppRouter'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './service/AuthContext';
import { LazyMotion, domAnimation } from "framer-motion"
import Maintenance from './components/Maintenance';
import AssistantIA from './components/AssistantIA';


function App() {

  const isMaintenanceMode = false; // Mettre à true pour activer le mode maintenance

    // Détection globale des erreurs de chargement de modules
  window.addEventListener('error', (e) => {
    if (e.message.includes('Failed to fetch dynamically imported module') || 
        e.message.includes('Importing a module script failed')) {
      window.location.reload();
    }
  }, true);

  // Optionnel : Capturer aussi les erreurs de promesses rejetées (pour certains navigateurs)
  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason?.message?.includes('Failed to fetch dynamically imported module')) {
      window.location.reload();
    }
});

  return (
    <>
      {isMaintenanceMode ? <Maintenance /> : (
        <AuthProvider>
          <LazyMotion features={domAnimation}>
            <AssistantIA />
            <RouterProvider router={router}/>
          </LazyMotion>
      </AuthProvider>
      )}
    </>
  )
}

export default App
