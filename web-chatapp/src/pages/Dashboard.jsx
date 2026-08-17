import { useState, useRef, useCallback, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
// components
import Chat from './DashboardComponents/Chat';
import Contact from "./DashboardComponents/Contact";
import Info from "./DashboardComponents/Info";
// conexts
import {chatbuf, screenSt, ThreadData, backBut, supabaseClient, userData, ThreadInfo, GetPerson, editYourInfo} from '../contexts';

// styles
import './dashboard.css';

//Custom Hooks
import useScreenState from "../hooks/useScreenState";

async function getPerson(supabase, PersonId)
{
    const{data, error} = await supabase
    .from("user")
    .select("user_id, name, imageUrl")
    .eq("user_id", PersonId)
    .single()
    return {data, error};
    
}

export default function Dashboard(){
    const navigate = useNavigate();
    // variables
    var chatBuffer = [
    
     ]
    // responsive variable the determines which component to render
    const [screenState, setScreenState] = useState(0);
    const [threadData, setThreadData] = useState({});
    const [threadInfo, setThreadInfo] = useState({});
    const [userInfo, setUserInfo] = useState(null);
    const [chatBuf, setChatBuf] = useState(chatBuffer);
    var contact = useRef(null);
    var chat = useRef(null);
    var info = useRef(null);
    var backbtn = useRef(null);
    useScreenState(contact, chat, info, backbtn, screenState);
    
    // socket supabase
    const supabase = useContext(supabaseClient);
    useEffect(()=>{
    const changes = supabase.channel("messageschange")
        .on('postgres_changes',{
            event: '*',
            schema: 'public',
            table: 'messages',
            },
            async (payload) => {
                //handle update and delete
                console.log(payload)
                const {data:author, error:authorError} = await getPerson(supabase, payload.new.created_by);
                console.log(author, authorError);
                payload.new.created_by = author;
                setChatBuf((prev)=> [...prev, payload.new]);
            }
        )
        .subscribe()        
    return () => {
        supabase.removeChannel(changes);
    };
    }, [])
    // fetch data
    useEffect(()=>{

        async function getData() {
            const id =  localStorage.getItem("id");
            const { data, error } = await supabase
            .from('user')
            .select(`
                user_id,
                name,
                phoneNumber,
                imageUrl,
                friends 
                `)
            .eq('user_id',id)
            .single();
            
            console.log(data, error);
            const { data: friends, error: friendError } = await supabase
            .from("user")
            .select("user_id, name, phoneNumber, imageUrl")
            .in("user_id", data.friends);
            console.log(friendError);
            
            data.friends = friends;
            console.log(data);
            if(error)
            {
                if(error.details = "The result contains 0 rows")
                {
                    // navigate("../enter");
                }
            }
            else{
                setUserInfo(data);
            }
        }
    getData()
    },[])

    return(
        <userData.Provider value={userInfo ?? {
            user_id: "",
            imageUrl: "",
            name : ""
        }}>
            
        <chatbuf.Provider value={[chatBuf, setChatBuf]} >
        <ThreadData.Provider value={[threadData, setThreadData]}>
        <ThreadInfo.Provider value={[threadInfo, setThreadInfo]}>
        <GetPerson.Provider value={getPerson}>
        <editYourInfo.Provider value={info}>

            <div id="dashboard">
                <screenSt.Provider value={{screenState, setScreenState}}>
                <backBut.Provider value={backbtn}>
                    <div id="container">
                        <Contact contactSection={contact}/>
                        <Chat  chat={chat}/>
                        <Info infoSection={info}/>
                    </div>
                </backBut.Provider>
                </screenSt.Provider>
            </div>
        </editYourInfo.Provider>
        </GetPerson.Provider>    
        </ThreadInfo.Provider>
        </ThreadData.Provider>
        </chatbuf.Provider>
        </userData.Provider>
    )

}

