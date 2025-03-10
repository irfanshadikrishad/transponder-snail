import { useState } from "react";
import { useAuth } from "../store/user";
// ICONS
import { AiOutlineClose } from "react-icons/ai";

export default function Drawer({ isdrawer }) {
  const { API, token, defaultAvatar, getAllChats, chats, setSelectedChat } =
    useAuth();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const createSingleChat = async (id) => {
    let alreadyExists = false;
    chats.map((ch_t, index) => {
      if (!ch_t.isGroup) {
        ch_t.users.map((userInChat) => {
          if (id === userInChat._id) {
            alreadyExists = true;
            setSelectedChat(ch_t);
          }
        });
      }
    });
    if (!alreadyExists) {
      const request = await fetch(`${API}/api/chat/single`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: id }),
      });
      const response = await request.json();
      if (request.status === 200) {
        isdrawer(false);
        getAllChats();
      } else {
        console.log(response);
      }
    } else {
      isdrawer(false);
    }
  };

  const getSearchAll = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value !== "") {
      const request = await fetch(
        `${API}/api/users/?search=${e.target.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const response = await request.json();

      if (request.status === 200) {
        setUsers(response);
      } else {
        console.log(response);
      }
    } else {
      setUsers([]);
    }
  };
  return (
    <div className="search_drawer">
      <div className="drawer_close_container">
        <button
          onClick={() => {
            isdrawer(false);
          }}
          className="drawer_close"
        >
          {<AiOutlineClose />}
        </button>
      </div>
      <div className="search_drawer_i">
        <input
          onChange={getSearchAll}
          name="search"
          value={searchQuery}
          type="search"
          placeholder="Search..."
        />
      </div>
      <div className="drawer_chats">
        {users.map((user) => {
          return (
            <div
              onClick={() => {
                createSingleChat(user._id);
              }}
              key={user._id}
              className="drawer_chat"
            >
              <img
                className="drawer_chat_avatar"
                src={user.avatar ? user.avatar.url : defaultAvatar}
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />
              <p>{user.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
