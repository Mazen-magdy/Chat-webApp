import {useContext, useEffect} from 'react';

import {chatbuf, userData, supabaseClient, ThreadData, GetPerson} from '../../../contexts';

function dateExtractor(dateIn)
{
    let date = new Date(dateIn)
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return `${hours}:${minutes}`;
}

async function getChatHistory(supabase, threadId, setChatBuf, getPerson)
{
    try {
        const {data, error} = await supabase
        .from("messages")
        .select("*")
        .eq("thread_id", threadId)
        console.log("chat history:", data, error);
        if (error) {
            console.error("messages query failed:", error);
            return;
        }

        const enrichedData = await Promise.all(
            (data ?? []).map(async (item) => {
                const {data: authorData, error: authorError} = await getPerson(supabase, item.created_by);
                if (authorError) {
                    console.error("author query failed:", authorError);
                    return {...item, created_by: null};
                }
                return {...item, created_by: authorData};
            })
        );

        setChatBuf(enrichedData);
    } catch (err) {
        console.error("getChatHistory failed:", err);
    }
}

export default function Body()
{
    const [chatBuf, setChatBuf] = useContext(chatbuf);
    const [threadData, setThreadData] = useContext(ThreadData);
    const getPerson = useContext(GetPerson);
    const userInfo= useContext(userData);
    const supabase= useContext(supabaseClient);
    console.log(chatBuf)
    //* render the chat history and add any new listened value 
    console.log(chatBuf[0], userInfo)
    useEffect(() => {
        if (!supabase || !threadData?.id) {
            console.log("skip getChatHistory: missing supabase or threadData.id", { threadData });
            return;
        }

        console.log("running getChatHistory for thread", threadData.id);
        getChatHistory(supabase, threadData.id, setChatBuf, getPerson);
    }, [supabase, threadData?.id])
    return(

        <div className='body'>
                {
                    chatBuf.map((content, index) => {
                        return (
                            <div key={index} className={`message ${ content?.created_by?.user_id == userInfo?.user_id ? "reciever": "sender"}`}>
                                <p className='information'>{content.payload}</p>
                                <p className='time'>{dateExtractor(content.created_at)}</p>
                                <p className='status disabled'></p>
                            </div>
                        );
                    })
                }
            </div>
    )
}