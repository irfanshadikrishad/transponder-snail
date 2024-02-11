import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../store/user";

export default function isGroup({ selectedChat, isAdmin }) {
  const { API, token, defaultAvatar } = useAuth();
  const { name, users } = selectedChat;
  const [modifiedUsers, setModifiedUsers] = useState(users);
  const [searchResults, setSearchResults] = useState([]);

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

  const deleteGroupMember = async (toBeDeletedId, toBeDeletedName) => {
    const request = await fetch(`${API}/api/chat/removeFromGroup`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chatId: selectedChat._id, userId: toBeDeletedId }),
    });
    const response = await request.json();
    if (request.status === 200) {
      successToast(`${toBeDeletedName} has been kicked out.`);
    } else {
      errorToast(response.error);
    }
  };

  const handleSearchUser = async (e) => {
    if (e.target.value !== "") {
      const request = await fetch(
        `${API}/api/users/?search=${e.target.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await request.json();
      if (request.status === 200) {
        setSearchResults(response);
      }
    }
  };
  const addToGroup = async (toBeAddedMember, toBeAddedObject) => {
    const request = await fetch(`${API}/api/chat/addToGroup`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: toBeAddedMember,
        chatId: selectedChat._id,
      }),
    });
    const response = await request.json();
    if (request.status === 200) {
      successToast(`${toBeAddedObject.name} added to the group.`);
      setModifiedUsers([...modifiedUsers, toBeAddedObject]);
    } else {
      errorToast(response.error);
    }
  };

  return (
    <section className="selectedGroup">
      <h1>{name}</h1>
      <p className="group_header">Members:</p>
      <div className="group_members">
        {modifiedUsers &&
          modifiedUsers.map((member, index) => {
            return (
              <div key={index} className="group_member">
                <p>{member.name}</p>
                {isAdmin && (
                  <button
                    onClick={() => {
                      deleteGroupMember(member._id, member.name);
                    }}
                  >
                    {<RxCross2 />}
                  </button>
                )}
              </div>
            );
          })}
      </div>
      {isAdmin && (
        <input
          onChange={handleSearchUser}
          name="add"
          placeholder="add user..."
        />
      )}
      <div className="create_group_searched">
        {searchResults.map((search) => {
          return (
            <div
              key={search._id}
              onClick={() => {
                addToGroup(search._id, search);
              }}
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
          );
        })}
      </div>
      <ToastContainer />
    </section>
  );
}
