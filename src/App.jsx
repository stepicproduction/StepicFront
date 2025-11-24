import './index.css'
import isPropValid from '@emotion/is-prop-valid';
import { StyleSheetManager } from 'styled-components';
import router from './routes/AppRouter'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './service/AuthContext';


function App() {

  return (
    <AuthProvider>
      {/* <StyleSheetManager shouldForwardProp={isPropValid}> */}
        <RouterProvider router={router}/>
      {/* </StyleSheetManager> */}
    </AuthProvider>
  )
}

export default App
