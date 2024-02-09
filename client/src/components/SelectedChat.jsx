import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useAuth } from "../store/user";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import ScrollableFeed from "react-scrollable-feed";

export default function SelectedChat({ selectedChat, setIsChatInfoOpen }) {
  const { user, API, token, errorToast, defaultAvatar } = useAuth();
  const [content, setContent] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  const getAllMessages = async () => {
    const request = await fetch(
      `${API}/api/message/single/${selectedChat._id}`,
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
      setAllMessages(response);
    } else {
      console.log(response);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (content) {
      const request = await fetch(`${API}/api/message/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, chatId: selectedChat._id }),
      });
      const response = await request.json();
      if (request.status === 200) {
        setContent("");
        setAllMessages([...allMessages, response]);
        console.log(allMessages);
      } else {
        console.log(response);
        errorToast(response.error);
      }
    }
  };

  useEffect(() => {
    getAllMessages();
  }, []);
  return (
    <div>
      <section className="chat__header">
        <p>
          {!selectedChat.isGroup && selectedChat.users[1]
            ? selectedChat.users[1]._id !== user._id
              ? selectedChat.users[1].name
              : selectedChat.users[0].name
            : selectedChat.name}
        </p>
        <button
          onClick={() => {
            setIsChatInfoOpen(true);
          }}
          className="chat__info"
        >
          {<HiOutlineDotsHorizontal />}
        </button>
      </section>
      <section className="chat_textarea">
        <ScrollableFeed>
          {allMessages.map((message, index) => {
            return (
              <div
                key={index}
                className={
                  message.sender._id === user._id ? "chat_i sent" : "chat_i"
                }
              >
                {message.sender._id !== user._id && (
                  <img
                    className="chat_avatar"
                    src={message.avatar ? message.avatar.url : defaultAvatar}
                    alt={`${message.name}'s avatar`}
                    draggable="false"
                  />
                )}
                <p
                  className={
                    message.sender._id === user._id
                      ? "chat_back chat_self"
                      : "chat_back chat_notself"
                  }
                >
                  {message.content}
                </p>
              </div>
            );
          })}
        </ScrollableFeed>
        <form onSubmit={sendMessage}>
          <input
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            id="send_message"
            placeholder="send message..."
          />
        </form>
      </section>
      <ToastContainer />
    </div>
  );
}
