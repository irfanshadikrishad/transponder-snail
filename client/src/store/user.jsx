import { useContext, createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('logger'));
    const isLoggedIn = !!token;

    const storeTokenInLS = (token) => {
        setToken(token);
        return localStorage.setItem('logger', token);
    }

    return (
        <AuthContext.Provider value={{ storeTokenInLS, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}
