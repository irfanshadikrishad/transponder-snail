import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function Login({ loginview }) {
    const [showPassword, setShowPassword] = useState(false);

    const login = async (e) => {
        e.preventDefault();
    }

    return (
        <form onSubmit={login} className="home_login">
            <h1>Login</h1>
            <input className="form_input" type="email" placeholder="email" />
            <div className="form_password">
                <input className="form_input" type={showPassword ? "text" : "password"} placeholder="password" autoComplete="true" />
                <button
                    className="show_password"
                    onClick={() => { setShowPassword(!showPassword) }}>
                    {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
            </div>
            <button className="form_submit" type="submit">Login</button>
            <p className="switch_lr" onClick={() => { loginview(false) }}>or create an account.</p>
        </form>
    )
}