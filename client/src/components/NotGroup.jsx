import { useAuth } from "../store/user";
// ICONS
import { RiChatDeleteFill } from "react-icons/ri";
import { BiSolidDislike } from "react-icons/bi";
import { MdClearAll } from "react-icons/md";
import { CgClose } from "react-icons/cg";

export default function NotGroup({ user, selectedChat, chatClose }) {
  const {
    API,
    defaultAvatar,
    token,
    errorToast,
    setSelectedChat,
    getAllChats,
  } = useAuth();

  const deleteChat = async (chatId) => {
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
      chatClose();
      setSelectedChat({});
      getAllChats();
    } else {
      errorToast(response.error);
    }
  };

  return (
    <div className="info_wrapper info_notgroup">
      <img
        className="chat_info_avatar"
        draggable="false"
        src={user.avatar ? user.avatar.url : defaultAvatar}
      />
      <h1 className="chat_info_name">{user.name}</h1>
      <p>{user.email}</p>

      <section className="notGroup_btns">
        <button disabled className="notGroup_btn leave_group">
          <CgClose /> Close Chat
        </button>
        <button disabled className="notGroup_btn leave_group">
          <MdClearAll /> Clear Chat
        </button>
        <button disabled className="notGroup_btn leave_group">
          <BiSolidDislike /> Report User
        </button>
        <button
          className="notGroup_btn delete_group"
          onClick={() => {
            deleteChat(selectedChat._id);
          }}
        >
          <RiChatDeleteFill /> Delete Chat
        </button>
      </section>
    </div>
  );
}
