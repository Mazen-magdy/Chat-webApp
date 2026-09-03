import { useContext } from "react";
import {userData, screenSt, editYourInfo} from "../../../contexts"

import edit from "../../../utilities/edit.svg";

export default function YourInfo()
{

    const userInfo =  useContext(userData);
    const editYourInfoSection =  useContext(editYourInfo).current;
    const {screenState, setScreenState} = useContext(screenSt);
    
    const handleMenuClick = () => {
        if(editYourInfoSection.style.display != 'none')
        {
            editYourInfoSection.style.display = 'none';
        }
        else{
            editYourInfoSection.style.display = 'block';
        }
        setScreenState(2); // Show Info component
    }

    return(
        <section id="yourInfo">
            {userInfo.imageUrl ? <img src={userInfo.imageUrl} id="profile" alt="Your profile" /> : <div id="profile" className="avatar-fallback" aria-hidden="true">{userInfo.name?.charAt(0)?.toUpperCase() || "?"}</div>}
            <div id="content">
                <h2>{userInfo.name || "Your profile"}</h2>
                {/* <p> {userInfo.bio} </p> */}
            </div>
            <img className="icons" src={edit} id="edit" alt="Edit profile" onClick={handleMenuClick}/>
        </section>
    )
}