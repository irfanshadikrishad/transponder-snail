import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/user";

export default function NavMenu({ profileModal }) {
    const navigate = useNavigate();
    const { deleteTokenFromLS } = useAuth();

    return (
        <div className="navMenu">
            <button onClick={() => { profileModal(true) }}>Profile</button>
            <button onClick={() => {
                deleteTokenFromLS();
                navigate('/');
            }} >Logout</button>
        </div>
    )
}
