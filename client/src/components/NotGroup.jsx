import { useAuth } from "../store/user";

export default function NotGroup({ user }) {
  const { defaultAvatar } = useAuth();

  return (
    <div>
      <img
        className="chat_info_avatar"
        draggable="false"
        src={user.avatar ? user.avatar.url : defaultAvatar}
      />
      <h1 className="chat_info_name">{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
