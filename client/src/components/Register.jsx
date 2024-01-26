import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function Register({ loginview }) {
    const [showPassword, setShowPassword] = useState(false);
    const [avatar, setAvatar] = useState('');

    const register = async (e) => {
        e.preventDefault();
    }

    return (
        <form onSubmit={register} className="home_login">
            <h1>Register</h1>
            <input type="file" accept="image/*" onChange={(e) => { setAvatar(e.target.files[0]); }} />
            <input className="form_input" type="text" placeholder="name" />
            <input className="form_input" type="email" placeholder="email" />
            <div className="form_password">
                <input className="form_input" type={showPassword ? "text" : "password"} placeholder="password" autoComplete="true" />
                <button
                    className="show_password"
                    onClick={() => { setShowPassword(!showPassword) }}>
                    {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
            </div>
            <button className="form_submit" type="submit">Register</button>
            <p className="switch_lr" onClick={() => { loginview(true) }}>back to login.</p>
        </form>
    )
}
