"use client";
import { useAuth } from "@/store/user";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
// ICONS
import { RiLogoutBoxRFill } from "react-icons/ri";
import { TbHelpHexagonFilled } from "react-icons/tb";
import { FaLanguage } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { PiUserCircleGearBold } from "react-icons/pi";

export default function UserInfoModal({ profileModalSwitch }) {
  const router = useRouter();
  const { user, defaultAvatar, deleteTokenFromLS } = useAuth();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

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
              <button disabled className="profile_btn">
                <PiUserCircleGearBold /> Settings
              </button>
              <button
                className="profile_btn delete_group"
                onClick={() => {
                  deleteTokenFromLS();
                  router.push("/");
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
