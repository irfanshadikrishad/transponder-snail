import { createPortal } from "react-dom";
import { useAuth } from "../store/user";
import { useEffect, useState } from "react";

export default function ChatInfoModal({ chatClose, selectedChat }) {
    const { user, defaultAvatar } = useAuth();
    const [reciver, setReciver] = useState({});


    useEffect(() => {
        if (user._id === selectedChat.users[0]._id) {
            setReciver(selectedChat.users[1]);
        } else {
            setReciver(selectedChat.users[0]);
        }
    }, [selectedChat])
    return createPortal(
        <section className="chat_info_background" onClick={(e) => {
            if (e.target.className === 'chat_info_background') {
                chatClose();
            }
        }}>
            <section className="chat_info_card">
                {selectedChat.isGroup ? <p>Group Chat</p> : <div>
                    <img
                        className="chat_info_avatar"
                        draggable="false"
                        src={reciver.avatar ? reciver.avatar.url : defaultAvatar} />
                    <h1 className="chat_info_name">{reciver.name}</h1>
                </div>}
            </section>
        </section>, document.getElementById('chat_info')
    )
}
