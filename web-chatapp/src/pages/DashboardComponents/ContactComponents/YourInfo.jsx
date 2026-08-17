import { useContext } from "react";
import {userData, screenSt, editYourInfo} from "../../../contexts"

import edit from "../../../utilities/edit.svg";
import tempProfile from "C:/Users/m0101/OneDrive/Pictures/MyPhotos/1000161993.jpg"

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
            <img src={userInfo.imageUrl} id="profile" />
            <div id="content">
                <h2>{userInfo.name}</h2>
                {/* <p> {userInfo.bio} </p> */}
            </div>
            <img className="icons" src={edit} id="edit" onClick={handleMenuClick}/>
        </section>
    )
}