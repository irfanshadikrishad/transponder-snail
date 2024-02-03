import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/user.jsx';
import Navbar from "../components/Navbar.jsx";
import ChatInfoModal from "../components/ChatInfoModal.jsx";
// TOASTIFY
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ICONS
import { MdOutlineAdd } from "react-icons/md";
import NotSelectedChat from "../components/NotSelectedChat.jsx";
import SelectedChat from "../components/SelectedChat.jsx";

export default function Chats() {
    const navigate = useNavigate();
    const { isLoggedIn, chats, defaultAvatar, user, API, token } = useAuth();
    const [selectedChat, setSelectedChat] = useState(null);
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);

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

    const getSelectedChat = async (chat) => {
        console.log(chat); // checker
        setSelectedChat(chat);
    }

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [chats])
    return (
        <section>
            <Navbar />
            <section className="chats">
                <section className="chat">
                    <div className="chat1_header">
                        <p>My Chats</p>
                        <button>Group {<MdOutlineAdd />}</button>
                    </div>
                    <div className="chat_all">
                        {chats && chats.map((chat) => {
                            return <div
                                key={chat._id}
                                onClick={() => { getSelectedChat(chat) }}
                                className="chat_tab">
                                <p>
                                    {(!chat.isGroup && chat.users[1]) ?
                                        (chat.users[1]._id !== user._id ?
                                            chat.users[1].name :
                                            chat.users[0].name) : chat.name}
                                </p>
                            </div>
                        })}
                    </div>
                </section>
                {isChatInfoOpen && <ChatInfoModal
                    chatClose={setIsChatInfoOpen}
                    selectedChat={selectedChat} />}
                <section className="chat">
                    {
                        selectedChat ? <SelectedChat
                            selectedChat={selectedChat}
                            setIsChatInfoOpen={setIsChatInfoOpen} /> :
                            <NotSelectedChat />
                    }
                </section>
            </section>
            <ToastContainer />
        </section>
    )
}
