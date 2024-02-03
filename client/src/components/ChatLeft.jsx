import { useState } from "react";
import { useAuth } from "../store/user";
import { MdOutlineAdd } from "react-icons/md";
import CreateGroupModal from "./CreateGroupModal";

export default function ChatLeft({ setSelectedChat }) {
    const { user, chats } = useAuth();
    const [isGroupModalActive, setIsGroupModalActive] = useState(false);

    const getSelectedChat = async (chat) => {
        setSelectedChat(chat);
    }

    return (
        <section className="chat">
            <div className="chat1_header">
                <p>My Chats</p>
                <button onClick={() => { setIsGroupModalActive(true) }}>
                    Group {<MdOutlineAdd />}
                </button>
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
            {isGroupModalActive && <CreateGroupModal setIsGroupModalActive={setIsGroupModalActive} />}
        </section>
    )
}
