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
    const [userInfo] = useContext(userData);
    const supabase = useContext(supabaseClient);
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(0);
    console.log(threadData)
    const sendMessageHandler = async (event) =>{
        if(message == "")
        {return }
        setIsSending(1);
        const error = await sendMessage(supabase, message, threadData.id, userInfo.user_id);
        if(!error)
        {
            setMessage("");
        }
        else{
            //error notification
        }
        setIsSending(0);
    }
    return(
        <div className='footer' aria-busy={Boolean(isSending)}>
                <img src={plusIcon} alt="Add attachment" />
            <textarea aria-label="Message" placeholder='Write a message...' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
            {isSending ? <span className="send-status" role="status">Sending...</span> : null}
            <img src={sendIcon} alt={isSending ? "Sending message" : "Send message"} onClick={sendMessageHandler} />
        </div>
    )
}