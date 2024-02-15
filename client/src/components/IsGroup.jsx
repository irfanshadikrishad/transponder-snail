import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../store/user";
import { RxCross2 } from "react-icons/rx";
import { MdGroupAdd } from "react-icons/md";

export default function isGroup({ selectedChat, isAdmin }) {
  const { API, token, defaultAvatar, successToast, errorToast } = useAuth();
  const { name, users } = selectedChat;
  const [modifiedUsers, setModifiedUsers] = useState(users);
  const [searchResults, setSearchResults] = useState([]);
  const [addMemberClicked, setAddMemberClicked] = useState(false);

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
        {isAdmin && (
          <div
            className="groupAddMember"
            onClick={() => {
              setAddMemberClicked(!addMemberClicked);
            }}
          >
            {<MdGroupAdd />} Add Members
          </div>
        )}
        {modifiedUsers &&
          modifiedUsers.map((member, index) => {
            return (
              <div key={index} className="group_member">
                <div className="groupMember_P1">
                  <img
                    src={member.avatar && member.avatar.url}
                    className="group_memberAvatar"
                    draggable="false"
                  />
                  <p>{member.name}</p>
                </div>
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
      {isAdmin && addMemberClicked && (
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
