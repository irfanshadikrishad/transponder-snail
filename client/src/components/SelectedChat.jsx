import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useAuth } from "../store/user";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import ScrollableFeed from "react-scrollable-feed";
import io from "socket.io-client";

export default function SelectedChat({ setIsChatInfoOpen }) {
  const { user, API, token, errorToast, defaultAvatar, selectedChat } =
    useAuth();
  const [content, setContent] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [isSocketConntected, setIsSocketConnected] = useState(false);
  const [socket, setSocket] = useState(null); // Initialize socket state
  const [selectedChatToBeCompared, setSelectedChatToBeCompared] =
    useState(null);

  useEffect(() => {
    getAllMessages();
    if (selectedChat) {
      const newSocket = io(API);
      newSocket.emit("setup", user);
      newSocket.on("connect", () => {
        setIsSocketConnected(true);
      });

      setSocket(newSocket); // Set the socket

      setSelectedChatToBeCompared(selectedChat);
      // return () => {
      //   newSocket.disconnect(); // Clean up socket on component unmount
      // };
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
      } else {
        console.log(response);
        errorToast(response.error);
      }
    }
  };

  useEffect(() => {
    console.log("useEffect running");
    console.log("Socket:", socket);
    console.log("socket status", socket);
    if (socket && socket.connected) {
      console.log("Socket is connected");
      socket.on("message_recived", (message) => {
        console.log("Message received:", message);
        if (
          !selectedChatToBeCompared ||
          selectedChatToBeCompared._id !== message.chat._id
        ) {
          console.log("Notification: New message received", message);
          // Add your notification logic here
        } else {
          console.log("Adding message to allMessages:", message);
          setAllMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    } else {
      console.log("Socket is not connected");
    }
  }, [socket, selectedChatToBeCompared]);

  return (
    <div>
      <section className="chat__header">
        {selectedChat && (
          <p>
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
          </p>
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
