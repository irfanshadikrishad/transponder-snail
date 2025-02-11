import { useState } from "react";
import { useAuth } from "../store/user";
import { MdOutlineAdd } from "react-icons/md";
import CreateGroupModal from "./CreateGroupModal";
import io from "socket.io-client";
import { getAvatar } from "../utils/helpers";

export default function ChatLeft() {
  const { API, setSelectedChat, user, chats, defaultAvatar } = useAuth();
  let socket = io(API);
  const [isGroupModalActive, setIsGroupModalActive] = useState(false);

  const getSelectedChat = async (chat) => {
    setSelectedChat(chat);
    socket.emit("join_chat", chat);
  };

  return (
    <section className="chat">
      <div className="chat1_header">
        <p>My Chats</p>
        <button
          onClick={() => {
            setIsGroupModalActive(true);
          }}
        >
          Group {<MdOutlineAdd />}
        </button>
      </div>
      <div className="chat_all">
        {chats &&
          chats.map((chat) => {
            console.log(chat);

            return (
              <div
                key={chat._id}
                onClick={() => {
                  getSelectedChat(chat);
                }}
                className="chat_tab"
              >
                <img
                  className="c1"
                  src={
                    chat.isGroup
                      ? defaultAvatar
                      : getAvatar(chat.users, user)
                        ? getAvatar(chat.users, user)
                        : defaultAvatar
                  }
                  alt=""
                  draggable="false"
                  onError={(e) => {
                    e.target.src = defaultAvatar;
                  }}
                />
                <div className="c2">
                  <p className="opponents one_line">
                    {!chat.isGroup
                      ? chat.users[1] && chat.users[1]._id !== user._id
                        ? chat.users[1].name
                        : chat.users[0].name
                      : chat.name}
                  </p>
                  {chat.latest && (
                    <p className="opponents_lastMessage one_line">
                      {chat.latest.sender._id === user._id
                        ? `You: `
                        : chat.isGroup && `${chat.latest.sender.name}: `}
                      {chat.latest.content && chat.latest.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      {isGroupModalActive && (
        <CreateGroupModal setIsGroupModalActive={setIsGroupModalActive} />
      )}
    </section>
  );
}
