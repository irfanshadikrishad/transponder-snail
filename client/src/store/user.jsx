import { useContext, createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const API = 'http://localhost:3001';
    const [token, setToken] = useState(localStorage.getItem('logger'));
    const [user, setUser] = useState({});
    const [chats, setChats] = useState([]);
    const isLoggedIn = !!token;

    const storeTokenInLS = (token) => {
        setToken(token);
        return localStorage.setItem('logger', token);
    }

    const deleteTokenFromLS = () => {
        setToken('');
        return localStorage.removeItem('logger');
    }

    const getAllChats = async () => {
        const request = await fetch(`${API}/api/chat/all`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        const response = await request.json();
        if (request.status === 200) {
            setChats(response);
        } else { console.log(response); }
    }

    const authenticate = async () => {
        const request = await fetch(`${API}/api/auth/user`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
        const response = await request.json();
        if (request.status === 200) {
            setUser(response);
        }
    }

    useEffect(() => {
        authenticate();
        getAllChats();
    }, [token])
    return (
        <AuthContext.Provider value={{ storeTokenInLS, isLoggedIn, API, user, deleteTokenFromLS, token, chats }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}
