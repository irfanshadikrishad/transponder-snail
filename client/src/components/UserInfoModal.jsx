import { useAuth } from "../store/user";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
// ICONS
import { RiLogoutBoxRFill } from "react-icons/ri";
import { TbHelpHexagonFilled } from "react-icons/tb";
import { FaLanguage } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";

export default function UserInfoModal({ profileModalSwitch }) {
  const navigate = useNavigate();
  const { user, defaultAvatar, deleteTokenFromLS } = useAuth();

  return createPortal(
    <section>
      <section
        className="profile_modal"
        onClick={(e) => {
          if (e.target.className === "profile_modal") {
            profileModalSwitch(false);
          }
        }}
      >
        {user && (
          <section className="profile_modal_card">
            <img
              className="inspect_avatar"
              src={user.avatar ? user.avatar.url : defaultAvatar}
              draggable="false"
            />
            <h1>{user.name}</h1>
            <p>{user.email}</p>

            <section className="profile_btns">
              <button disabled className="profile_btn">
                <IoNotifications /> Notifications
              </button>
              <button disabled className="profile_btn">
                <FaLanguage /> App Language
              </button>
              <button disabled className="profile_btn">
                <TbHelpHexagonFilled /> Help
              </button>
              <button
                className="profile_btn delete_group"
                onClick={() => {
                  deleteTokenFromLS();
                  navigate("/");
                }}
              >
                <RiLogoutBoxRFill /> Logout
              </button>
            </section>
          </section>
        )}
      </section>
    </section>,
    document.getElementById("user_info")
  );
}
