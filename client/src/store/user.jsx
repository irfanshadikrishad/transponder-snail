import { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API = "http://localhost:3001";
  const defaultAvatar =
    "https://i.pinimg.com/564x/a3/ce/d8/a3ced81768f0d838ac1dada5a85b7ac2.jpg";
  const [token, setToken] = useState(localStorage.getItem("logger"));
  const [user, setUser] = useState({});
  const [chats, setChats] = useState([]);
  const isLoggedIn = !!token;

  const storeTokenInLS = (token) => {
    setToken(token);
    return localStorage.setItem("logger", token);
  };

  const deleteTokenFromLS = () => {
    setToken("");
    return localStorage.removeItem("logger");
  };

  const getAllChats = async () => {
    const request = await fetch(`${API}/api/chat/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await request.json();
    if (request.status === 200) {
      setChats(response);
    } else {
      console.log(response);
    }
  };

  const authenticate = async () => {
    const request = await fetch(`${API}/api/auth/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await request.json();
    if (request.status === 200) {
      setUser(response);
    }
  };

  function successToast(success) {
    toast.success(success, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  function errorToast(error) {
    toast.error(error, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  useEffect(() => {
    authenticate();
    getAllChats();
  }, [token]);
  return (
    <AuthContext.Provider
      value={{
        storeTokenInLS,
        isLoggedIn,
        API,
        user,
        deleteTokenFromLS,
        token,
        chats,
        defaultAvatar,
        getAllChats,
        successToast,
        errorToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
