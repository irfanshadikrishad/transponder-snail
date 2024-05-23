import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();
  const [redirectIn, setRedirectIn] = useState(10);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRedirectIn((prevRedirectIn) => {
        if (prevRedirectIn <= 1) {
          navigate("/");
          clearInterval(intervalId);
        } else {
          return prevRedirectIn - 1;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);
  return (
    <section className="error">
      <img
        src="https://i.pinimg.com/originals/c0/12/dd/c012dd6e30c2d6a9925a69af3891960d.gif"
        alt="error_gif"
        className="error_gif"
        draggable="false"
      />
      <p>Page not found. Error 404.</p>
      <p>Redirecting in {redirectIn} sec.</p>
    </section>
  );
}
