export default function ContactListItem({id, name, user_id, lastMessage, avatar, clickHandler }) {
  return (
    <div className="person" onClick={clickHandler} id = {id} data-id={user_id} role="button" tabIndex="0" aria-label={`Open conversation with ${name}`}>
      {avatar != null ? <img src={avatar} alt="" /> : <div className="avatar-fallback" aria-hidden="true">{name?.charAt(0)?.toUpperCase() || "?"}</div>}
      <div className="info">
        <h3>{name}</h3>
        <p className="lastmessage">{lastMessage}</p>
      </div>
    </div>
  );
}
