"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/store/user";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// ICONS
import { RxCross2 } from "react-icons/rx";

export default function CreateGroupModal({ setIsGroupModalActive }) {
  const { defaultAvatar, token, getAllChats, errorToast, user } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [groupUsers, setGroupUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  function isDuplicate(arr, newObj) {
    for (let obj of arr) {
      if (obj._id === newObj._id) {
        return true;
      }
    }
    return false;
  }

  const addToGroup = (toBeAddedObject) => {
    if (!isDuplicate(groupUsers, toBeAddedObject)) {
      setGroupUsers([...groupUsers, toBeAddedObject]);
    }
  };

  const removeFromGroup = (toBeRemoved) => {
    setGroupUsers(
      groupUsers.filter((existedUser) => existedUser._id !== toBeRemoved._id)
    );
  };

  const handleCreateSearch = async (e) => {
    if (e.target.value !== "") {
      const request = await fetch(`/api/users/?search=${e.target.value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await request.json();
      if (request.status === 200) {
        setSearchResults(response);
      }
    } else {
      setSearchResults([]);
    }
  };

  const createGroupChat = async () => {
    const users = groupUsers.map((gusers) => gusers._id);
    const users_names = groupUsers.map((gusers) => gusers.name).join(", ");
    if (users) {
      const request = await fetch(`/api/chat/group/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          users: users,
          name: groupName === "" ? users_names : groupName,
        }),
      });
      const { message } = await request.json();
      if (request.status === 201) {
        setIsGroupModalActive(false);
        setGroupName("");
        setGroupUsers([]);
        setSearchResults([]);
        getAllChats();
      } else {
        errorToast(message);
      }
    }
  };

  return createPortal(
    <section className="create_group_modal">
      <section className="create_group_inside">
        <input
          onChange={(e) => setGroupName(e.target.value)}
          name="groupName"
          type="text"
          placeholder="Group Name..."
        />
        <div className="added_users">
          {groupUsers.map((group, i) => (
            <div key={i} className="addedUser">
              {group.name}{" "}
              <button onClick={() => removeFromGroup(group)}>
                <RxCross2 />
              </button>
            </div>
          ))}
        </div>
        <input
          onChange={handleCreateSearch}
          type="search"
          placeholder="Search..."
        />
        <div className="create_group_searched">
          {searchResults.map((search, i) => (
            <div
              onClick={() => addToGroup(search)}
              key={i}
              className="create_group_user_search"
            >
              <img
                draggable="false"
                className="create_group_user_avatar"
                src={search.avatar ? search.avatar.url : defaultAvatar}
              />
              <div className="create_group_user_text">
                <p>{search.name}</p>
                <p>{search.email}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="create_group_buttons">
          <button onClick={() => setIsGroupModalActive(false)}>Close</button>
          <button onClick={createGroupChat}>Create</button>
        </div>
      </section>
      <ToastContainer />
    </section>,
    document.getElementById("create_group")
  );
}
