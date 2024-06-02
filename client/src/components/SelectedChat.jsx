import { useAuth } from "../store/user";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import ScrollableFeed from "react-scrollable-feed";
import io from "socket.io-client";
import { Helmet } from "react-helmet";
// TOOLTIP
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
// ICONS
import { IoInformationCircle } from "react-icons/io5";
import { TbArrowBackUp } from "react-icons/tb";
import { FiSend } from "react-icons/fi";
import { IoMdCall, IoIosVideocam } from "react-icons/io";
// UTILS
import { linkify } from "../utils/linkify";

export default function SelectedChat({ setIsChatInfoOpen }) {
  const {
    user,
    API,
    token,
    errorToast,
    defaultAvatar,
    selectedChat,
    setSelectedChat,
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
          // console.log("notification", message);
        } else {
          getAllMessages();
          getAllChats();
        }
      });
    }
    // else {
    //   console.log("Socket is not connected", socket);
    // }
  });

  return (
    <div>
      <Helmet>
        <title>
          {selectedChat.name
            ? `@${selectedChat.name} / transponder-snail`
            : user.name === selectedChat.users[0].name
            ? `${selectedChat.users[1].name} / transponder-snail`
            : `${selectedChat.users[0].name} / transponder-snail`}
        </title>
      </Helmet>
      <section className="chat__header">
        {selectedChat && (
          <div className="chat_header_left">
            <button
              onClick={() => {
                setSelectedChat({});
              }}
            >
              {<TbArrowBackUp />}
            </button>
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
        <section className="selectedChat_buns">
          <button disabled className="chat__info">
            <IoMdCall />
          </button>
          <button disabled className="chat__info">
            <IoIosVideocam />
          </button>
          <button
            onClick={() => {
              setIsChatInfoOpen(true);
            }}
            className="chat__info"
          >
            {<IoInformationCircle />}
          </button>
        </section>
      </section>
      <section className="chat_textarea">
        <ScrollableFeed>
          {allMessages &&
            allMessages.map(
              ({ sender, content, name, chat, createdAt }, index) => {
                const previousMessageSender =
                  index > 0 ? allMessages[index - 1] : null;

                return (
                  <div
                    key={index}
                    className={
                      sender._id === user._id ? "chat_i sent" : "chat_i"
                    }
                  >
                    {/* if its logged in users message don't show the avatar */}
                    {sender._id !== user._id && previousMessageSender
                      ? previousMessageSender.sender.email !== sender.email && (
                          <img
                            data-tooltip-id={selectedChat.isGroup && "tooltip"}
                            data-tooltip-content={sender.name}
                            data-tooltip-place="top-start"
                            className="chat_avatar"
                            src={
                              sender.avatar.url
                                ? sender.avatar.url
                                : defaultAvatar
                            }
                            alt={`${name}'s avatar`}
                            draggable="false"
                          />
                        )
                      : sender._id !== user._id && (
                          <img
                            data-tooltip-id={selectedChat.isGroup && "tooltip"}
                            data-tooltip-content={sender.name}
                            data-tooltip-place="top-start"
                            className="chat_avatar"
                            src={
                              sender.avatar.url
                                ? sender.avatar.url
                                : defaultAvatar
                            }
                            alt={`${name}'s avatar`}
                            draggable="false"
                          />
                        )}
                    <p
                      data-tooltip-id="time"
                      data-tooltip-content={String(createdAt).slice(0, 10)}
                      data-tooltip-place="right"
                      className={
                        // sender._id === user._id
                        //   ? "chat_back chat_self"
                        //   : previousMessageSender &&
                        //     previousMessageSender.email !== sender.email
                        //   ? "chat_back chat_notself"
                        //   : "chat_back chat_notself noImageSender"
                        sender._id === user.id
                          ? `chat_back chat_self`
                          : `chat_back chat_notself ${
                              previousMessageSender &&
                              previousMessageSender.sender.email ===
                                sender.email &&
                              "noImageSender"
                            }`
                      }
                      dangerouslySetInnerHTML={{
                        __html: linkify(content),
                      }}
                    ></p>
                  </div>
                );
              }
            )}
        </ScrollableFeed>
        <form onSubmit={sendMessage} className="sendMessage">
          {isTyping && <p className="typing">{isTyping.name} is typing...</p>}
          <input
            value={content}
            onChange={typingHandler}
            id="send_message"
            placeholder="send message..."
            autoComplete="off"
          />
          <button type="submit" className="sendMessage_button">
            {<FiSend />}
          </button>
        </form>
      </section>
      <ToastContainer />
      <Tooltip id="tooltip" />
      <Tooltip id="time" />
    </div>
  );
}
