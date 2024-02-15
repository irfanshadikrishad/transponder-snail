import React, { useEffect, useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import { useAuth } from "../store/user";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/chats");
    }
  }, []);
  return (
    <section className="home_auth">
      {isLoginView ? (
        <Login loginview={setIsLoginView} />
      ) : (
        <Register loginview={setIsLoginView} />
      )}
    </section>
  );
}
