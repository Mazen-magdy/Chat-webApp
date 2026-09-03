export default function ContactListItem({keys, name, lastMessage, avatar, clickHandler }) {
  return (
    <div className="person" onClick={clickHandler} id = {keys} role="button" tabIndex="0" aria-label={`Open conversation with ${name}`}>
      {avatar ? <img src={avatar} alt="" /> : <div className="avatar-fallback" aria-hidden="true">{name?.charAt(0)?.toUpperCase() || "?"}</div>}
      <div className="info">
        <h3>{name}</h3>
        <p className="lastmessage">{lastMessage}</p>
      </div>
    </div>
  );
}
