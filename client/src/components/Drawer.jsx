import { useState } from "react";
import { useAuth } from "../store/user";
// ICONS
import { FiSearch } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";

export default function Drawer({ isdrawer }) {
    const { API, token, defaultAvatar, getAllChats } = useAuth();
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const createSingleChat = async (id) => {
        const request = await fetch(`${API}/api/chat/single`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userId: id })
        });
        const response = await request.json();
        if (request.status === 200) {
            isdrawer(false);
            getAllChats();
        } else {
            console.log(response);
        }
    }

    const getSearchAll = async () => {
        const request = await fetch(`${API}/api/users/?search=${searchQuery}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
        const response = await request.json();

        if (request.status === 200) {
            setUsers(response);
        } else { console.log(response); }
    }
    return (
        <div
            className="search_drawer">
            <div
                className="drawer_close_container">
                <button
                    onClick={() => { isdrawer(false) }}
                    className="drawer_close">
                    {<AiOutlineClose />}
                </button>
            </div>
            <div
                className="search_drawer_i">
                <input
                    onChange={(e) => { setSearchQuery(e.target.value) }}
                    name="search" value={searchQuery}
                    type="search"
                    placeholder="Search..." />
                <button
                    onClick={getSearchAll}
                    type="search">
                    {<FiSearch />}
                </button>
            </div>
            <div className="drawer_chats">
                {users.map((user) => {
                    return <div
                        onClick={() => { createSingleChat(user._id) }}
                        key={user._id}
                        className="drawer_chat"
                    >
                        <img
                            className="drawer_chat_avatar"
                            src={user.avatar ? user.avatar.url : defaultAvatar} />
                        <p>{user.name}</p>
                    </div>
                })}
            </div>
        </div>
    )
}
