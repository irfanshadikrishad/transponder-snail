import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../store/user";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RxCross2 } from "react-icons/rx";

export default function ChatInfoModal({ chatClose, selectedChat }) {
    const { API, token, user, defaultAvatar, getAllChats } = useAuth();
    const [reciver, setReciver] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const isAdminChecker = async () => {
        if (selectedChat.isAdmin._id === user._id) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }

    function successToast(success) {
        toast.success(success, {
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

    const deleteGroupMember = async (toBeDeletedId) => {
        const request = await fetch(`${API}/api/chat/removeFromGroup`,
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ chatId: selectedChat._id, userId: toBeDeletedId })
            })
        const response = await request.json();
        if (request.status === 200) {
            successToast(`removed`);
        } else {
            errorToast(response.error);
        }
    }
    const handleSearchUser = async (e) => {
        if (e.target.value !== '') {
            const request = await fetch(`${API}/api/users/?search=${e.target.value}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
            const response = await request.json();
            if (request.status === 200) {
                setSearchResults(response);
            }
        }
    }

    const addToGroup = async (toBeAddedMember) => {
        const request = await fetch(`${API}/api/chat/addToGroup`,
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ userId: toBeAddedMember, chatId: selectedChat._id })
            })
        const response = await request.json();
        if (request.status === 200) {
            successToast('added to group');
        } else {
            errorToast(response.error);
        }
    }

    useEffect(() => {
        isAdminChecker();
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
                {selectedChat.isGroup ? <section className="selectedGroup">
                    <h1>{selectedChat.name}</h1>
                    <p className="group_header">Members:</p>
                    <div className="group_members">
                        {selectedChat.users && selectedChat.users.map((member) => {
                            return <div key={member._id} className="group_member">
                                <p>{member.name}</p>
                                {isAdmin &&
                                    <button
                                        onClick={() => { deleteGroupMember(member._id) }}>
                                        {<RxCross2 />}
                                    </button>}
                            </div>
                        })}
                    </div>
                    {isAdmin && <input
                        onChange={handleSearchUser}
                        name="add"
                        placeholder="add user..." />}
                    <div className="create_group_searched">
                        {searchResults.map((search) => {
                            return <div
                                key={search._id}
                                onClick={() => { addToGroup(search._id) }}
                                className="create_group_user_search">
                                <img
                                    draggable="false"
                                    className="create_group_user_avatar"
                                    src={search.avatar ? search.avatar.url : defaultAvatar} />
                                <div className="create_group_user_text">
                                    <p>{search.name}</p>
                                    <p>{search.email}</p>
                                </div>
                            </div>
                        })}
                    </div>
                </section> : <div>
                    <img
                        className="chat_info_avatar"
                        draggable="false"
                        src={reciver.avatar ? reciver.avatar.url : defaultAvatar} />
                    <h1 className="chat_info_name">{reciver.name}</h1>
                </div>}
            </section>
            <ToastContainer />
        </section>, document.getElementById('chat_info')
    )
}
