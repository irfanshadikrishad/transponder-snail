import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useAuth } from "../store/user";

export default function SelectedChat({ selectedChat, setIsChatInfoOpen }) {
    const { user } = useAuth();

    return (
        <div>
            <section className="chat__header">
                <h1>{
                    (!selectedChat.isGroup && selectedChat.users[1]) ?
                        (selectedChat.users[1]._id !== user._id ?
                            selectedChat.users[1].name :
                            selectedChat.users[0].name) : selectedChat.name
                }
                </h1>
                <button
                    onClick={() => { setIsChatInfoOpen(true) }}
                    className="chat__info">
                    {<HiOutlineDotsHorizontal />}
                </button>
            </section>
            <section className="chat_textarea"></section>
        </div>
    )
}
