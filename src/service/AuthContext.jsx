import {useContext, createContext, useState, useEffect } from 'react'
import { instance } from './api';

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
    //const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'))
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [userImage, setUserImage] = useState(null)
    const [userEmail, setUserEmail] = useState(null)
    const [userId, setUserId] = useState(null)

    const updateUserImage = (newImageUrl) => {
        setUserImage(newImageUrl);
        localStorage.setItem('user_image', newImageUrl)
    }

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userRole = localStorage.getItem('user_role');
        const storedName = localStorage.getItem('user_name');
        const storedImage = localStorage.getItem('user_image');
        const storedEmail = localStorage.getItem('user_email')
        const storedId = localStorage.getItem('user_id')

        if(token && userRole) {
            setIsAuthenticated(!!token);
            setRole(userRole || null);
            setUsername(storedName || null);
            setUserImage(storedImage || null);
            setUserEmail(storedEmail || null)
            setUserId(storedId)
        }

       
        
        setLoading(false);
    }, []);

    const loginSuccess = (userRole, userName, userImageUrl, email, id) => {
        setIsAuthenticated(true)
        setRole(userRole);
        setUsername(userName);
        setUserImage(userImageUrl)
        setUserEmail(email)
        setUserId(id)

        localStorage.setItem('user_role', userRole); // On stocke le rôle côté client
        localStorage.setItem('user_name', userName);
        localStorage.setItem('user_image', userImageUrl);
        localStorage.setItem('user_email', email)
        localStorage.setItem('user_id', id)

        const token = localStorage.getItem('access_token')
        if(token && instance) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }

    const logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_image');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_id')

        setIsAuthenticated(false);
        setRole(null);
        setUsername(null);
        setUserImage(null);
        setUserEmail(null);
        setUserId(null)

        if(instance) {
            delete instance.defaults.headers.common['Authorization'];
        }
    }

    const value = {
        isAuthenticated,
        role,
        username,
        userImage,
        userEmail,
        userId,

        loginSuccess, // La page Login appellera cette fonction
        logout,
        updateUserImage,
    } 

    const updateContextImage = (newImageUrl) => {
        setUserImage(newImageUrl);
    };

    if (loading) return null

    return <AuthContext.Provider value={{...value, updateContextImage}}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext);
};