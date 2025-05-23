import { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  let API = import.meta.env.VITE_API;
  const defaultAvatar = "/da.jpg";
  const [token, setToken] = useState(localStorage.getItem("logger"));
  const [user, setUser] = useState({});
  const [chats, setChats] = useState([]);
  const isLoggedIn = !!token;
  const [selectedChat, setSelectedChat] = useState({});

  const storeTokenInLS = (token) => {
    setToken(token);
    return localStorage.setItem("logger", token);
  };

  const deleteTokenFromLS = () => {
    setToken("");
    return localStorage.removeItem("logger");
  };

  const getAllChats = async () => {
    if (token) {
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
    }
  };

  const authenticate = async () => {
    // It should prevent useless request on server now.
    if (token) {
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
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
