import { useContext, useEffect, useState } from "react";
//components
import Header from "./ChatComponents/Header";
import Body from "./ChatComponents/Body";
import Footer from "./ChatComponents/Footer";
//contexts
import {chatbuf, ThreadData, userData, ThreadInfo, supabaseClient, GetPerson} from "../../contexts";
//utils
import plusIcon from '../../utilities/plusIcon.svg';
import sendIcon from '../../utilities/sendIcon.svg';
//libs
import { ClipLoader } from "react-spinners";
async function getThreadInfo(supabase, threadData, userData, getPerson)
{

    console.log(threadData, userData)
    if(threadData && userData)
    {
        if(threadData.Type == "DM")
        {
            let personId = threadData.Members.find((id) => id != threadData.user_id);
            let data =  userData.friends.find((friend) => {return friend.user_id == personId})
            console.log(data);
            if(data == undefined)
            {
                // not a friend
                const {data: fetchedPerson, error} = await getPerson(supabase, personId);
                if (error) {
                    console.error(error);
                    return undefined;
                }
                data = fetchedPerson;
                console.log(data)
            }
            return data;
        }
    }
    else{
        console.log("no chat to render")
    }
}


export default function Chat({ chat }) {
    //contexts
    let chatBuffer = useContext(chatbuf);
    const supabase = useContext(supabaseClient);
    const [threadData, setThreadData] = useContext(ThreadData);
    const [threadInfo, setThreadInfo] = useContext(ThreadInfo);
    const userInfo = useContext(userData);
    const getPerson = useContext(GetPerson);
    //states
    const [isLoading, setIsLoading] = useState(0);
    console.log(userInfo)
    useEffect(()=>{
        (async function() {
            setIsLoading(1);
            const threadInf = await getThreadInfo(supabase, threadData, userInfo, getPerson);
            console.log(threadInf)
            setThreadInfo(threadInf);
            setIsLoading(0);
        })()
    }, [supabase, threadData, userInfo, getPerson, setThreadInfo])
    console.log("chat render")
    return (
        <section id="chat" ref={chat}>
            {isLoading ? <div className="chat-loading" role="status"><ClipLoader /><span>Loading conversation...</span></div> : ""}
            <Header />
            <Body />
            <Footer />
        </section>
    );
}