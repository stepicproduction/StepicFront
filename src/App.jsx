import './index.css'
import router from './routes/AppRouter'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './service/AuthContext';
import { LazyMotion, domAnimation } from "framer-motion"
import Maintenance from './components/Maintenance';


function App() {

  const isMaintenanceMode = true; // Mettre à true pour activer le mode maintenance

  return (
    <>
      {isMaintenanceMode ? <Maintenance /> : (
        <AuthProvider>
          <LazyMotion features={domAnimation}>
            <RouterProvider router={router}/>
          </LazyMotion>
      </AuthProvider>
      )}
    </>
  )
}

export default App
