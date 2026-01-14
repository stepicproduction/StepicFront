import './index.css'
import router from './routes/AppRouter'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './service/AuthContext';
import { LazyMotion, domAnimation } from "framer-motion"
import Maintenance from './components/Maintenance';
import AssistantIA from './components/AssistantIA';


function App() {

  const isMaintenanceMode = false; // Mettre à true pour activer le mode maintenance

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
