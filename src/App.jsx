import router from './routes/AppRouter'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './service/AuthContext';


function App() {

  return (
    <AuthProvider>
        <RouterProvider router={router}/>
    </AuthProvider>
  )
}

export default App
