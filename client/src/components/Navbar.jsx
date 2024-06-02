import { useState } from "react";
import { useAuth } from "../store/user";
// COMPONENTS
import Drawer from "./Drawer";
// ICONS
import { FiSearch } from "react-icons/fi";
import UserInfoModal from "./UserInfoModal";

export default function Navbar() {
  const { user, defaultAvatar } = useAuth();
  const [isMenu, setIsMenu] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [profileModal, setProfileModal] = useState(false);

  return (
    <nav>
      <div className="search_container">
        <button
          onClick={() => {
            setIsDrawerOpen(true);
          }}
        >
          {<FiSearch />}
        </button>
        {isDrawerOpen && <Drawer isdrawer={setIsDrawerOpen} />}
      </div>

      {profileModal && <UserInfoModal profileModalSwitch={setProfileModal} />}
      <div
        onClick={() => {
          setProfileModal(true);
        }}
        className="navbar_right"
      >
        <img
          className="profile_avatar"
          src={user.avatar ? user.avatar.url : defaultAvatar}
        />
        <h1>{user.name}</h1>
      </div>
    </nav>
  );
}
