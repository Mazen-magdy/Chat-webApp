import { useContext } from "react";
import { userData, screenSt, InfoState, InfoRef } from "../../contexts";
import Edit from "./InfoComponents/Edit"
import ThreadInfo from "./InfoComponents/ThreadInfo"
import InfoHead from "./InfoComponents/InfoHead"


export default function Info() {
  const [userInfo, setUserInfo] = useContext(userData);
  const inforef = useContext(InfoRef);
  const { screenState, setScreenState } = useContext(screenSt);
  const [infoState, setInfoState] = useContext(InfoState);
  return (
      <section id="info"  ref = {inforef}>
        <div className="info-container">
        
        <InfoHead
            inforef = {inforef}
            screenState={screenState} 
            setScreenState={setScreenState} />
        {
          {
            0: <></>,
            1: <Edit
            userInfo={userInfo}
            setUserInfo = {setUserInfo} />,
            2: <ThreadInfo />
          }[infoState]  
        }
        
        </div>
      </ section>
  );
}
