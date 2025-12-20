import './index.css'
import router from './routes/AppRouter'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './service/AuthContext';
import { LazyMotion, domAnimation } from "framer-motion"


function App() {

  return (
    <AuthProvider>
      <LazyMotion features={domAnimation}>
        <RouterProvider router={router}/>
      </LazyMotion>
    </AuthProvider>
  )
}

export default App
