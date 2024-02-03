import { useState } from "react";
import { useAuth } from "../store/user";
import { createPortal } from 'react-dom';
// TOASTIFY
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ICONS
import { RxCross2 } from "react-icons/rx";

export default function CreateGroupModal({ setIsGroupModalActive }) {
    const { API, defaultAvatar, token, getAllChats } = useAuth();
    const [searchResults, setSearchResults] = useState([]);
    const [groupUsers, setGroupUsers] = useState([]);
    const [groupName, setGroupName] = useState('');

    function isDuplicate(arr, newObj) {
        for (let obj of arr) {
            if (obj._id === newObj._id) {
                return true;
            }
        }
        return false;
    }

    const addToGroup = async (toBeAddedObject) => {
        if (!isDuplicate(groupUsers, toBeAddedObject)) {
            setGroupUsers([...groupUsers, toBeAddedObject])
        } else {
            console.log(`duplicate detected ${toBeAddedObject.name}`);
        }
    }
    const removeFromGroup = async (toBeRemoved) => {
        let newGroupUsers = groupUsers.filter(existedUser => existedUser._id !== toBeRemoved._id);
        setGroupUsers(newGroupUsers);
    }

    const handleCreateSearch = async (e) => {
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

    const createGroupChat = async () => {
        const users = groupUsers.map((gusers) => gusers._id);
        if (users) {
            const request = await fetch(`${API}/api/chat/createGroup`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ users: users, name: groupName })
                })
            const response = await request.json();
            if (request.status === 201) {
                setIsGroupModalActive(false);
                setGroupName('');
                setGroupUsers([]);
                setSearchResults([]);
                getAllChats();
            } else { errorToast(response.error) }
        }
    }

    return createPortal(
        <section className="create_group_modal">
            <section className="create_group_inside">
                <input
                    onChange={(e) => { setGroupName(e.target.value) }}
                    name="groupName"
                    type="text"
                    placeholder="Group Name..." />
                <div className="added_users">
                    {groupUsers && groupUsers.map((group, i) => {
                        return <div key={i} className="addedUser">
                            {group.name} <button onClick={() => { removeFromGroup(group) }} >
                                {<RxCross2 />}
                            </button>
                        </div>
                    })}
                </div>
                <input
                    onChange={handleCreateSearch}
                    type="search"
                    placeholder="Search..." />
                <div className="create_group_searched">
                    {searchResults && searchResults.map((search, i) => {
                        return <div
                            onClick={() => { addToGroup(search) }}
                            key={i}
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
                <div className="create_group_buttons">
                    <button onClick={() => { setIsGroupModalActive(false) }}>Close</button>
                    <button onClick={() => { createGroupChat() }}>Create</button>
                </div>
            </section>
            <ToastContainer />
        </section>, document.getElementById('create_group')
    )
}
