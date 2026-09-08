import { useContext, useState } from "react";
import {userData, screenSt, InfoState, Info} from "../../../contexts"

import edit from "../../../utilities/edit.svg";

import ImgViewer from "../../../helperComponents/ImgViewer"
export default function YourInfo()
{
    const [viewImgData, setViewImgData] = useState({state : 0, url : ""});
    const [userInfo, setUserInfo] =  useContext(userData);
    const [infoState, setInfoState] = useContext(InfoState);
    const {screenState, setScreenState} = useContext(screenSt);
    
    const handleMenuClick = () => {
        if(screenState != 1)
        {
            setInfoState(1);
        }
        if(screenState[0] != 2)
            setScreenState([2, screenState[0]]); // Show Info component
        else
            setScreenState([screenState[1], screenState[0]]);
    }
    const handleImgClose = (e) =>{
        setViewImgData({state : 0, url : viewImgData.url});
    }
    const handleImgMagnify = (e) =>{
        setViewImgData({state : 1, url : e.target.getAttribute('src')});
    }
    return(
        <section id="yourInfo">
            {userInfo.imageUrl ? <img src={userInfo.imageUrl} id="profile" className="profile-avatar" alt="Your profile" onClick={handleImgMagnify} /> : <div id="profile" className="avatar-fallback profile-avatar" aria-hidden="true">{userInfo.name?.charAt(0)?.toUpperCase() || "?"}</div>}
            <div id="content">
                <h2>{userInfo.name || "Your profile"}</h2>
                {/* <p> {userInfo.bio} </p> */}
            </div>
            <img className="icons" src={edit} id="edit" alt="Edit profile" onClick={handleMenuClick}/>
        <ImgViewer 
            isActive = {viewImgData.state}
            imgURL={viewImgData.url}
            onClose={handleImgClose}
        />
        </section>
    )
}