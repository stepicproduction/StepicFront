import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {useAuth} from "./AuthContext"

const ProtectedRoute = () => {
    // Récupère l'état d'authentification global
    const { isAuthenticated } = useAuth();
    console.log("Auth status : ", isAuthenticated)

  // Récupère l'URL que l'utilisateur essayait d'atteindre
    const location = useLocation();
    
    if(!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from : location }} />
    }

    return <Outlet />
}

export default ProtectedRoute