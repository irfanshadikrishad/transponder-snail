import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/user.jsx";
import Navbar from "../components/Navbar.jsx";
import ChatInfoModal from "../components/ChatInfoModal.jsx";
import SelectedChat from "../components/SelectedChat.jsx";
import NotSelectedChat from "../components/NotSelectedChat.jsx";
import ChatLeft from "../components/ChatLeft.jsx";
// TOASTIFY
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Chats() {
  const navigate = useNavigate();
  const { isLoggedIn, chats, selectedChat } = useAuth();
  const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", checkScreenSize);

    checkScreenSize();

    return () => window.removeEventListener("resize", checkScreenSize);
  }, [chats]);
  return (
    <section>
      <Navbar />
      <section className="chats">
        {isMobile && !selectedChat._id ? (
          <ChatLeft />
        ) : (
          !isMobile && <ChatLeft />
        )}
        {isMobile && selectedChat._id ? (
          <section className="chat">
            {selectedChat._id ? (
              <SelectedChat setIsChatInfoOpen={setIsChatInfoOpen} />
            ) : (
              <NotSelectedChat />
            )}
            {isChatInfoOpen && <ChatInfoModal chatClose={setIsChatInfoOpen} />}
          </section>
        ) : (
          !isMobile && (
            <section className="chat">
              {selectedChat._id ? (
                <SelectedChat setIsChatInfoOpen={setIsChatInfoOpen} />
              ) : (
                <NotSelectedChat />
              )}
              {isChatInfoOpen && (
                <ChatInfoModal chatClose={setIsChatInfoOpen} />
              )}
            </section>
          )
        )}
      </section>
      <ToastContainer />
    </section>
  );
}
