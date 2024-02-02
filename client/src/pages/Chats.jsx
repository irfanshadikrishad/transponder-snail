import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/user.jsx';
import Navbar from "../components/Navbar.jsx";
// TOASTIFY
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ICONS
import { MdOutlineAdd } from "react-icons/md";

export default function Chats() {
    const navigate = useNavigate();
    const { isLoggedIn, chats, defaultAvatar, user, API, token } = useAuth();
    const [selectedChat, setSelectedChat] = useState(null);

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
                                {/* {(!chat.isGroup && chat.users) && < img
                                    className="my_chats_avatar"
                                    src={(chat.users[0]._id !== user._id ?
                                        (chat.users[0].avatar ? chat.users[0].avatar : defaultAvatar) :
                                        (chat.users[1].avatar ? chat.users[1].avatar : defaultAvatar))
                                    } />} */}
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
                <section className="chat">
                    {selectedChat ? <div>
                        <h1>{(!selectedChat.isGroup && selectedChat.users[1]) ?
                            (selectedChat.users[1]._id !== user._id ?
                                selectedChat.users[1].name :
                                selectedChat.users[0].name) : selectedChat.name}</h1>
                        <section className="chat_textarea">
                        </section>
                    </div> : <div className="not_selected">
                        <p>Select chat to interect.</p>
                    </div>}
                </section>
            </section>
            <ToastContainer />
        </section>
    )
}
