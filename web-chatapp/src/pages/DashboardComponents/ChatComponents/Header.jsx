import {useContext, useState} from 'react';
//contexts
import {chatbuf, screenSt, backBut, ThreadData, InfoState} from '../../../contexts';

import ImgViewer from '../../../helperComponents/ImgViewer';
//utils
import searchIcon from '../../../utilities/search.svg';
import infoIcon from   '../../../utilities/info.svg';
import leftArrow from   '../../../utilities/leftArrow.svg';

export default function Header()
{
    const [viewImgData, setViewImgData] = useState({state : 0, url : ""});
    const {screenState, setScreenState} = useContext(screenSt);
    // contexts
    let chatBuffer =  useContext(chatbuf);
    let backButton = useContext(backBut);
    const [infoState, setInfoState] = useContext(InfoState);
    const [threadData, setThreadData] = useContext(ThreadData);
    
    const ThreadDetailsHandler = (event)=>{
        if(infoState != 2)
        {
            setInfoState(2);
        }
        if(screenState[0] != 2)
            setScreenState([2, screenState[0]]);
        else
            setScreenState(screenState[1], screenState[0])
    }
    const backToContactsHandler = ()=>{
        setScreenState([0, screenState[0]]);
    }
      const handleImgClose = (e) =>{
        setViewImgData({state : 0, url : viewImgData.url});
    }
    const handleImgMagnify = (e) =>{
        setViewImgData({state : 1, url : e.target.getAttribute('src')});
    }
    console.log(threadData)
    return(
          <div className='header'>
                <img src={leftArrow} ref={backButton} onClick={backToContactsHandler} className='backbtn' alt='Back to contacts'></img>
                <img className='thread-avatar' src={threadData?.imageUrl} onClick={handleImgMagnify} alt="Conversation avatar" />
                <h1 className='name'>
                    {threadData?.name || "Choose a conversation"}
                </h1>
                <div className='icons'>
                    <img src={searchIcon} alt="Search messages" />
                    <img src={infoIcon} alt="Conversation info" onClick={ThreadDetailsHandler}/>
                </div>
                <ImgViewer
                    isActive={viewImgData.state}
                    imgURL = {viewImgData.url}
                    onClose={handleImgClose}
                />
            </div>
    )
}