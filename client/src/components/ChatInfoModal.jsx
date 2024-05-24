import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../store/user";
import IsGroup from "./IsGroup";
import NotGroup from "./NotGroup";

export default function ChatInfoModal({ chatClose }) {
  const { user, selectedChat } = useAuth();
  const [reciver, setReciver] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const isAdminChecker = async () => {
    if (selectedChat.isAdmin && selectedChat.isAdmin._id === user._id) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    isAdminChecker();
    if (user._id === selectedChat.users[0]._id) {
      setReciver(selectedChat.users[1]);
    } else {
      setReciver(selectedChat.users[0]);
    }
  }, [selectedChat]);
  return createPortal(
    <section
      className="chat_info_background"
      onClick={(e) => {
        if (e.target.className === "chat_info_background") {
          chatClose();
        }
      }}
    >
      <section
        className="chat_info_card"
        style={{ textAlign: !selectedChat.isGroup && "center" }}
      >
        {selectedChat.isGroup ? (
          <IsGroup
            isAdmin={isAdmin}
            selectedChat={selectedChat}
            chatClose={chatClose}
          />
        ) : (
          <NotGroup user={reciver} />
        )}
      </section>
    </section>,
    document.getElementById("chat_info")
  );
}
