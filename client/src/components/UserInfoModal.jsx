import { useAuth } from "../store/user";
import { createPortal } from "react-dom";

export default function UserInfoModal({ profileModalSwitch }) {
  const { user, defaultAvatar } = useAuth();

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
          </section>
        )}
      </section>
    </section>,
    document.getElementById("user_info")
  );
}
