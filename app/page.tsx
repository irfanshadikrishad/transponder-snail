"use client";
import React, { useEffect, useState } from "react";
import Login from "@/components/Login";
import Register from "@/components/Register";
import { useAuth } from "@/store/user";
import { useRouter } from "next/navigation";
import HomeSocial from "@/components/HomeSocial";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/chats");
    }
  }, []);
  return (
    <section className="home_auth">
      {isLoginView ? (
        <Login loginview={setIsLoginView} />
      ) : (
        <Register loginview={setIsLoginView} />
      )}
      <HomeSocial />
    </section>
  );
}
