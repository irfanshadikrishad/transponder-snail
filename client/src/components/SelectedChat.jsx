import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useAuth } from "../store/user";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import ScrollableFeed from "react-scrollable-feed";
import io from "socket.io-client";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function SelectedChat({ setIsChatInfoOpen }) {
  const {
    user,
    API,
    token,
    errorToast,
    defaultAvatar,
    selectedChat,
    getAllChats,
  } = useAuth();
  const [content, setContent] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [isSocketConntected, setIsSocketConnected] = useState(false);
  const [socket, setSocket] = useState(null); // Initialize socket state
  const [selectedChatToBeCompared, setSelectedChatToBeCompared] =
    useState(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    getAllMessages();
    if (selectedChat) {
      const newSocket = io(API);
      newSocket.emit("setup", user);
      newSocket.on("connect", () => {
        setIsSocketConnected(true);
      });
      setSocket(newSocket);
      setSelectedChatToBeCompared(selectedChat);
    }
  }, [selectedChat, API, user]);

  const getAllMessages = async () => {
    if (selectedChat._id) {
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
        setAllMessages([]);
      }
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    socket.emit("stop_typing", selectedChat, user);
    if (content && isSocketConntected) {
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
        socket.emit("send_message", response);
        setAllMessages([...allMessages, response]);
        getAllChats();
      } else {
        console.log(response);
        errorToast(response.error);
      }
    }
  };

  const typingHandler = (e) => {
    setContent(e.target.value);

    if (!isSocketConntected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat, user);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop_typing", selectedChat, user);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    if (socket) {
      socket.on("typing", (sendTo) => {
        console.log("typing", sendTo.name);
        setIsTyping(sendTo);
      });
      socket.on("stop_typing", (sendTo) => {
        setIsTyping(false);
        console.log("stop_typing", sendTo.name);
      });
      socket.on("message_recived", (message) => {
        if (
          !selectedChatToBeCompared ||
          selectedChatToBeCompared._id !== message.chat._id
        ) {
          console.log("notification", message);
        } else {
          getAllMessages();
          getAllChats();
        }
      });
    } else {
      console.log("Socket is not connected", socket);
    }
  });

  return (
    <div>
      <section className="chat__header">
        {selectedChat && (
          <div>
            <p>
              {selectedChat && selectedChat.isGroup
                ? selectedChat.name
                : selectedChat &&
                  selectedChat.users &&
                  selectedChat.users.length > 0 &&
                  selectedChat.users[0]._id === user._id // check if in index 0 current user or not
                ? selectedChat.users.length > 1
                  ? selectedChat.users[1].name
                  : null // Return null if there's only one user in the chat
                : selectedChat &&
                  selectedChat.users &&
                  selectedChat.users.length > 0 &&
                  selectedChat.users[0].name}
            </p>
          </div>
        )}
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
          {allMessages &&
            allMessages.map((message, index) => {
              return (
                <div
                  key={index}
                  className={
                    message.sender._id === user._id ? "chat_i sent" : "chat_i"
                  }
                >
                  {message.sender._id !== user._id && (
                    <img
                      data-tooltip-id="tooltip"
                      data-tooltip-content={message.sender.name}
                      data-tooltip-place="top-start"
                      className="chat_avatar"
                      src={
                        message.sender.avatar.url
                          ? message.sender.avatar.url
                          : defaultAvatar
                      }
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
          {isTyping && <p className="typing">{isTyping.name} is typing...</p>}
          <input
            value={content}
            onChange={typingHandler}
            id="send_message"
            placeholder="send message..."
            autoComplete="off"
          />
        </form>
      </section>
      <ToastContainer />
      <Tooltip id="tooltip" />
    </div>
  );
}
