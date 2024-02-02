import { useState } from "react";
import { useAuth } from "../store/user";
// COMPONENTS
import Drawer from "./Drawer";
import NavMenu from "./NavMenu";
// ICONS
import { FiSearch } from "react-icons/fi";
import { IoChevronDownOutline } from "react-icons/io5";

export default function Navbar() {
    const { user, defaultAvatar } = useAuth();
    const [isMenu, setIsMenu] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [profileModal, setProfileModal] = useState(false);

    return (
        <nav>
            <div className="search_container">
                <button onClick={() => { setIsDrawerOpen(true) }}>
                    {<FiSearch />}
                </button>
                {isDrawerOpen && <Drawer isdrawer={setIsDrawerOpen} />}
            </div>
            {profileModal && <section>
                <section
                    className="profile_modal"
                    onClick={() => { setProfileModal(false) }}>
                    {user
                        &&
                        <section
                            className="profile_modal_card">
                            <img
                                className="inspect_avatar"
                                src={user.avatar ?
                                    user.avatar.url :
                                    defaultAvatar}
                                draggable="false" />
                            <h1>{user.name}</h1>
                            <p>{user.email}</p>
                        </section>}
                </section>
            </section>}
            <div
                onClick={() => { setIsMenu(!isMenu) }}
                className="navbar_right">
                <img
                    className="profile_avatar"
                    src={user.avatar ?
                        user.avatar.url :
                        defaultAvatar} />
                <h1>{user.name}</h1>
                {<IoChevronDownOutline />}
                {isMenu && <NavMenu profileModal={setProfileModal} />}
            </div>
        </nav>
    )
}
