import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../store/user";
// ICONS
import { RxCross2 } from "react-icons/rx";
import { MdGroupAdd, MdReportProblem } from "react-icons/md";
import { FiEdit3, FiCheck } from "react-icons/fi";
import { RiChatDeleteFill } from "react-icons/ri";
import { FaPersonRunning } from "react-icons/fa6";

export default function isGroup({ selectedChat, isAdmin, chatClose }) {
  const {
    API,
    token,
    defaultAvatar,
    successToast,
    errorToast,
    getAllChats,
    setSelectedChat,
    user,
  } = useAuth();
  const { name, users } = selectedChat;
  const [modifiedUsers, setModifiedUsers] = useState(users);
  const [searchResults, setSearchResults] = useState([]);
  const [addMemberClicked, setAddMemberClicked] = useState(false);
  const [isEditNameOn, setIsEditNameOn] = useState(false);
  const [newChatName, setNewChatName] = useState("");

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
      setModifiedUsers(response.users);
      successToast(`${toBeDeletedName} has been kicked out.`);
    } else {
      errorToast(response.error);
    }
  };

  const leaveGroup = async (user_id) => {
    const request = await fetch(`${API}/api/chat/removeFromGroup`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chatId: selectedChat._id, userId: user_id }),
    });
    const response = await request.json();

    if (request.status === 200) {
      chatClose();
      setSelectedChat({});
      getAllChats();
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

  function doesUserExist(userId) {
    let exist = false;
    modifiedUsers.map((user) => {
      if (user._id === userId) {
        console.log(user._id, userId);
        exist = true;
      }
    });
    return exist;
  }

  const renameGroup = async () => {
    const request = await fetch(`${API}/api/chat/renameGroup`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chatId: selectedChat._id, chatName: newChatName }),
    });

    const { error } = await request.json();
    if (request.status === 200) {
      successToast(`name updated successfully`);
      setIsEditNameOn(false);
      chatClose();
      setSelectedChat({});
      getAllChats();
    } else {
      errorToast(error);
    }
  };

  const addToGroup = async (toBeAddedMember_Id, toBeAddedMember_Object) => {
    if (!doesUserExist(toBeAddedMember_Id)) {
      const request = await fetch(`${API}/api/chat/addToGroup`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: toBeAddedMember_Id,
          chatId: selectedChat._id,
        }),
      });
      const response = await request.json();
      if (request.status === 200) {
        successToast(`${toBeAddedMember_Object.name} added to the group.`);
        setModifiedUsers([...modifiedUsers, toBeAddedMember_Object]);
      } else {
        errorToast(response.error);
      }
    } else {
      errorToast(`${toBeAddedMember_Object.name} already exist in the group.`);
    }
  };

  const deleteGroup = async (chatId) => {
    const request = await fetch(`${API}/api/chat/delete_group`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chatId }),
    });

    const response = await request.json();

    if (request.status === 200) {
      successToast(`deleted ${name}`);
      chatClose();
      setSelectedChat({});
      getAllChats();
    } else {
      errorToast(response.error);
    }
  };

  function convertTimestamp(timestamp) {
    const date = new Date(timestamp);

    const day = date.getUTCDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getUTCFullYear();
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format

    const ordinalSuffix = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const formattedDate = `${ordinalSuffix(
      day
    )} ${month} ${year} ${hours}:${minutes} ${ampm}`;
    return formattedDate;
  }

  return (
    <section className="selectedGroup">
      <section className="selectedGroupName">
        {isEditNameOn && isAdmin ? (
          <input
            type="text"
            placeholder={name}
            value={newChatName}
            onChange={(e) => {
              setNewChatName(e.target.value);
            }}
          />
        ) : (
          <h1>{name}</h1>
        )}
        {isAdmin && isEditNameOn && (
          <button onClick={renameGroup}>{<FiCheck />}</button>
        )}
        {isAdmin && (
          <button
            onClick={() => {
              setIsEditNameOn(!isEditNameOn);
            }}
          >
            {<FiEdit3 />}
          </button>
        )}
      </section>
      <p className="createdAt">
        created at: {convertTimestamp(selectedChat.createdAt)}
      </p>
      <section className="groupDivider">
        <div>
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
                        src={member.avatar ? member.avatar.url : defaultAvatar}
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
        </div>
        <div className="groupDivider_right">
          <button
            className="leave_group"
            onClick={() => {
              leaveGroup(user._id);
            }}
          >
            <FaPersonRunning /> leave group
          </button>
          <button className="leave_group">
            <MdReportProblem /> report group
          </button>
          {isAdmin && (
            <button
              className="delete_group"
              onClick={() => {
                deleteGroup(selectedChat._id);
              }}
            >
              <RiChatDeleteFill /> delete group
            </button>
          )}
        </div>
      </section>
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
