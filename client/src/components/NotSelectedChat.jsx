import { BsChatHeart } from "react-icons/bs";

export default function NotSelectedChat() {
  return (
    <div className="not_selected">
      <p className="not_selected_icon">{<BsChatHeart />}</p>
      <p>Select chat to interect.</p>
    </div>
  );
}
