import { useEffect, useState } from "react";
import ImgViewer from "../../helperComponents/ImgViewer";
export default function ContactListItem({id, name, user_id, lastMessage, avatar, clickHandler }) {
   const [isSmall, setIsSmall] = useState(0)
   const [viewImgData, setViewImgData] = useState({state : 0, url : ""});
   const handleImgClose = (e) =>{
        setViewImgData({state : 0, url : viewImgData.url});
    }
    const handleImgMagnify = (e) =>{
        setViewImgData({state : 1, url : e.target.getAttribute('src')});
    }
  return (
    <div className="person" onClick={clickHandler} id = {id} data-id={user_id} role="button" tabIndex="0" aria-label={`Open conversation with ${name}`}>
      {avatar != null ? <img src={avatar} alt="" onClick={handleImgMagnify} /> : <div className="avatar-fallback" aria-hidden="true">{name?.charAt(0)?.toUpperCase() || "?"}</div>}

   <div className="info">
      <h3>{name}</h3>
      <p className="lastmessage">{lastMessage}</p>
  </div>,
     
  
      <ImgViewer 
        isActive={viewImgData.state}
        imgURL={viewImgData.url}
        onClose={handleImgClose}
      />
    </div>
  );
}
