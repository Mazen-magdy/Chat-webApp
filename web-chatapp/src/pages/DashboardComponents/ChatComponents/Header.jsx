import {useContext} from 'react';
//contexts
import {chatbuf, screenSt, backBut, ThreadInfo} from '../../../contexts';

//utils
import searchIcon from '../../../utilities/search.svg';
import infoIcon from   '../../../utilities/info.svg';
import leftArrow from   '../../../utilities/leftArrow.svg';

export default function Header()
{
    const {screenState, setScreenState} = useContext(screenSt);
    // contexts
    let chatBuffer =  useContext(chatbuf);
    let backButton = useContext(backBut);
    const [threadInfo, setThreadInfo] = useContext(ThreadInfo);
    const profileviewHandler = (event)=>{
        setScreenState(2);
    }
    const backToContactsHandler = ()=>{
        setScreenState(0);
    }
    console.log(threadInfo)
    return(
          <div className='header'>
                <img src={leftArrow} ref={backButton} onClick={backToContactsHandler} className='backbtn' alt='Back to contacts'></img>
                <h1 className='name'>
                    {threadInfo?.name || "Choose a conversation"}
                </h1>
                <div className='icons'>
                    <img src={searchIcon} alt="Search messages" />
                    <img src={infoIcon} alt="Conversation info" onClick={profileviewHandler}/>
                </div>
            </div>
    )
}