"use client";
import { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const defaultAvatar = "./avatar.jpg";
  const SOCKET_SERVER_URL =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  const getStoredToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("logger") : null;

  const [token, setToken] = useState(getStoredToken);
  const [user, setUser] = useState({});
  const [chats, setChats] = useState([]);
  const isLoggedIn = !!token;
  const [selectedChat, setSelectedChat] = useState({});

  const storeTokenInLS = (token) => {
    setToken(token);
    if (typeof window !== "undefined") {
      localStorage.setItem("logger", token);
    }
  };

  const deleteTokenFromLS = () => {
    setToken("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("logger");
    }
  };

  const getAllChats = async () => {
    if (token) {
      const request = await fetch(`/api/chat`, {
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
    if (token) {
      const request = await fetch(`/api/user`, {
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
        SOCKET_SERVER_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
