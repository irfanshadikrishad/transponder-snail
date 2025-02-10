"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/user";
import Navbar from "@/components/Navbar";
import ChatInfoModal from "@/components/ChatInfoModal";
import SelectedChat from "@/components/SelectedChat.jsx";
import NotSelectedChat from "@/components/NotSelectedChat.jsx";
import ChatLeft from "@/components/ChatLeft.jsx";
// TOASTIFY
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Chats() {
  const router = useRouter();
  const { isLoggedIn, chats, selectedChat } = useAuth();
  const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 960);
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
