import {useContext} from 'react';

import {screenSt} from "../../contexts";

export default function Profile({ info })
{
    const {screenState, setScreenState} = useContext(screenSt);
    
    return(
        <section id="profile" className='disabled' ref={info} ></section>
    )
}