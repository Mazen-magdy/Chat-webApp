import {useContext} from "react"
import {userData, InfoState} from "../../../contexts"
import closeIcon from "../../../utilities/leftArrow.svg";
export default function InfoHead({inforef, screenState, setScreenState})
{
    console.log(screenState)
    const userInfo = useContext(userData);
    const [infoState, setInfoState] = useContext(InfoState);
    const handleClose = () => {
        console.log("close")
        if(infoState == 2)
            setInfoState(0);
        if(screenState[0] != screenState[1])
            setScreenState([screenState[1], screenState[0]]); // Go back to contacts
        else
            setScreenState([0,2])
        // inforef.current.classList.add("disabled");
    };
    return(
        <>
         <div className="info-header">
                  <h2>Profile</h2>
                  <img
                    src={closeIcon}
                    alt="close"
                    className="close-btn"
                    onClick={handleClose}
                  />
                </div>
        </>
    )
}