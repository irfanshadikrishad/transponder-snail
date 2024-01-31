import React, { useEffect } from "react";
import { useAuth } from '../store/user.jsx';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import { MdOutlineAdd } from "react-icons/md";

export default function Chats() {
    const navigate = useNavigate();
    const { isLoggedIn, chats } = useAuth();

    useEffect(() => {
        console.log(chats);
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
                                className="chat_tab">
                                <p>{chat.name}</p>
                            </div>
                        })}
                    </div>
                </section>
                <section className="chat">chats 2</section>
            </section>
        </section>
    )
}
