import { FaGithub } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

export default function HomeSocial() {
  return (
    <section className="home_social">
      <a href="https://github.com/irfanshadikrishad" target="_blank">
        {<FaGithub />}
      </a>
      <a href="https://www.youtube.com/@irfanshadikrishad" target="_blank">
        {<FaYoutube />}
      </a>
    </section>
  );
}
