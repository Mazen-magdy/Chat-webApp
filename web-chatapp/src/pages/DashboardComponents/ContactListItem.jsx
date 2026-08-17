export default function ContactListItem({keys, name, lastMessage, avatar, clickHandler }) {
  return (
    <div className="person" onClick={clickHandler} id = {keys}>
      <img src={avatar} alt="contact" />
      <div className="info">
        <h3>{name}</h3>
        <p className="lastmessage">{lastMessage}</p>
      </div>
    </div>
  );
}
