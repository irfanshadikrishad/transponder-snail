import { FiSearch } from "react-icons/fi";
import { useAuth } from "../store/user";
import { IoChevronDownOutline } from "react-icons/io5";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Drawer from "./Drawer";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, deleteTokenFromLS } = useAuth();
    const [isMenu, setIsMenu] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);


    return (
        <nav>
            <div className="search_container">
                <button onClick={() => { setIsDrawerOpen(true) }}>{<FiSearch />}</button>
                {isDrawerOpen && <Drawer isdrawer={setIsDrawerOpen} />}
            </div>
            <div onClick={() => { setIsMenu(!isMenu) }} className="navbar_right">
                <img className="profile_avatar" src={user.avatar ? user.avatar.url : "https://i.pinimg.com/564x/a3/ce/d8/a3ced81768f0d838ac1dada5a85b7ac2.jpg"} />
                {<IoChevronDownOutline />}
                {isMenu && <div className="navMenu">
                    <button>Profile</button>
                    <button onClick={() => {
                        deleteTokenFromLS();
                        navigate('/');
                    }} >Logout</button>
                </div>}
            </div>
        </nav>
    )
}
