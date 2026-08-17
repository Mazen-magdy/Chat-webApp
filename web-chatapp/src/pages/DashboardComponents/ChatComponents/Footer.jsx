import { useContext, useState } from 'react';
import plusIcon from '../../../utilities/plusIcon.svg';
import sendIcon from '../../../utilities/sendIcon.svg';

import { userData, ThreadData, supabaseClient } from '../../../contexts';

async function sendMessage(supabase, message, threadId, authorId)
{
    const { error } = await supabase
    .from('messages')
    .insert({ 
        created_by: authorId,
        thread_id: threadId,
        payload  : message
     })
     console.log(error)
     return error
}

export default function Footer()
{
    const [threadData, setThreadData] = useContext(ThreadData)
    const uData = useContext(userData);
    const supabase = useContext(supabaseClient);
    const [message, setMessage] = useState("");
    console.log(threadData)
    const sendMessageHandler = async (event) =>{
        if(message == "")
        {return }
        const error = await sendMessage(supabase, message, threadData.id, uData.user_id);
        if(!error)
        {
            setMessage("");
        }
        else{
            //error notification
        }
    }
    return(
        <div className='footer'>
                <img src={plusIcon} alt="plus" />
                <textarea placeholder='write your message' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                <img src={sendIcon} alt="send" onClick={sendMessageHandler} />
        </div>
    )
}