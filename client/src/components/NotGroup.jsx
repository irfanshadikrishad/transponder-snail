export default function NotGroup({ reciver, defaultAvatar }) {
  return (
    <div>
      <img
        className="chat_info_avatar"
        draggable="false"
        src={reciver.avatar ? reciver.avatar.url : defaultAvatar}
      />
      <h1 className="chat_info_name">{reciver.name}</h1>
    </div>
  );
}
