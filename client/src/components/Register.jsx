import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function Register({ loginview }) {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false);
    const [avatar, setAvatar] = useState('null');

    const handleInput = async (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    }

    const register = async (e) => {
        e.preventDefault();
        const cloud = new FormData();
        cloud.append('file', avatar);
        cloud.append('upload_preset', 'den-den-mushi');
        cloud.append('cloud_name', 'dgczy8tct');
        const avatarRequest = await fetch('https://api.cloudinary.com/v1_1/dgczy8tct/image/upload', {
            method: "POST",
            body: cloud
        })
        const avatarResponse = await avatarRequest.json();

        const request = await fetch('http://localhost:3001/api/auth/register',
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    avatar: avatarRequest.status === 200 && avatarResponse,
                    name: user.name,
                    email: user.email,
                    password: user.password
                })
            })
        const response = await request.json();
        if (request.status === 200) {
            console.log(response);
        } else {
            console.log(response);
        }
    }

    return (
        <form onSubmit={register} className="home_login">
            <h1>Register</h1>
            <input type="file"
                accept="image/*"
                onChange={(e) => { setAvatar(e.target.files[0]); }} />
            <input onChange={handleInput}
                className="form_input"
                type="text"
                name="name"
                value={user.name}
                placeholder="name"
                required={true} />
            <input onChange={handleInput}
                className="form_input"
                type="email"
                name="email"
                value={user.email}
                placeholder="email"
                required={true} />
            <div className="form_password">
                <input onChange={handleInput}
                    className="form_input"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={user.password}
                    placeholder="password"
                    required={true}
                    autoComplete="true" />
                <button
                    className="show_password"
                    onClick={() => { setShowPassword(!showPassword) }}>
                    {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
            </div>
            <button
                className="form_submit"
                type="submit">
                Register
            </button>
            <p
                className="switch_lr"
                onClick={() => { loginview(true) }}>
                back to login.
            </p>
        </form>
    )
}
