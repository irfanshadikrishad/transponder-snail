import React, { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Login from "../components/Login";
import Register from "../components/Register";

export default function Home() {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <section className="home_auth">
            {isLoginView ? <Login loginview={setIsLoginView} /> : <Register loginview={setIsLoginView} />}
        </section>
    )
}
