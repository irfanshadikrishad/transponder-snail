import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/user.jsx';
import Navbar from "../components/Navbar.jsx";
import ChatInfoModal from "../components/ChatInfoModal.jsx";
import SelectedChat from "../components/SelectedChat.jsx";
import NotSelectedChat from "../components/NotSelectedChat.jsx";
import ChatLeft from "../components/ChatLeft.jsx";
// TOASTIFY
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Chats() {
    const navigate = useNavigate();
    const { isLoggedIn, chats } = useAuth();
    const [selectedChat, setSelectedChat] = useState(null);
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [chats])
    return (
        <section>
            <Navbar />
            <section className="chats">
                <ChatLeft setSelectedChat={setSelectedChat} />
                <section className="chat">
                    {
                        selectedChat ? <SelectedChat
                            selectedChat={selectedChat}
                            setIsChatInfoOpen={setIsChatInfoOpen} /> :
                            <NotSelectedChat />
                    }
                    {isChatInfoOpen && <ChatInfoModal
                        chatClose={setIsChatInfoOpen}
                        selectedChat={selectedChat} />}
                </section>
            </section>
            <ToastContainer />
        </section>
    )
}
