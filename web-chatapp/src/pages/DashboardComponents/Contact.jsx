import {useContext, useState, useRef, useEffect} from 'react';

// hooks
import { useContactPanel } from '../../hooks/useContactPanel';

// contexts
import {screenSt, ThreadData, userData, supabaseClient} from "../../contexts";

// Components
import YourInfo from "./ContactComponents/YourInfo";

// utils
import searchIcon from '../../utilities/search.svg';
import User1 from '../../utilities/user1.jpg';
import ContactListItem from './ContactListItem';
import { data } from 'react-router-dom';


async function searchForUser(supabase, phone, friends){
  
  let friend = []
  friend =friends.find((friend) => friend.phoneNumber == phone)
  console.log(phone, friend);
  if(friend)
  {
    return {data : [friend], error : undefined};
  }
  else
  {
    if(phone.length < 10)
    {
      return {data : [], error : undefined};
    }
    const { data, error } = await supabase
    .from('user')
    .select(`*`)
    .eq('phoneNumber', phone)
    console.log(data, error);
    return {data: data || [], error};  
  }

}

async function getThreadFriend(supabase, keys)
{
  console.log(keys)
  const { data, error } = await supabase
  .from('threads')
  .select('*')
  .eq('Type', "DM")
  .contains("Members", keys);
  console.log(data, error);
  if(!data)
  {
    console.log("new Thread")
    const{error:creationError} = await supabase
    .from('threads')
    .insert(
      {
        created_by : keys[0],
        Type : "DM",
        Members: keys
      }
    )
    const { data, error } = await supabase
    .from('threads')
    .select('*')
    .eq('Type', "DM")
    .contains("Members", keys);
    console.log(data, error);
    return {data, error};
  }
  else
  {
    return {data, error};
  }
}

async function getThreadGroup(supabase, keys)
{
  console.log(keys)
  const { data, error } = await supabase
  .from('threads')
  .select('*')
  .eq('Type', "Group")
  .eq("id", keys);
  console.log(data, error);
  return {data, error};
}



export default function Contact(props) {
  console.log("render-------------------------------------")
  //props extraction
  const {contactSection} = props;
  //states
  const [searchResults, setSearchResult] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  // ref
  let contactsRef = useRef([
    {
      id: 1,
      name: 'Moamen Hassabllah',
      lastMessage: 'اي الاخبار',
      avatar: User1,
    },
    {
      id: 1,
      name: 'Moamen Hassabllah',
      lastMessage: 'اي الاخبار',
      avatar: User1,
    },
  ]);
  // var contacts = contactsRef.current
  // context variables
  const {screenState, setScreenState} = useContext(screenSt);
  const [threadData, setThreadData] = useContext(ThreadData);
  const userInfo = useContext(userData);
  const supabase = useContext(supabaseClient);
  // handlers
  useEffect(()=>{
    // Only initialize contacts on first load
    if(!isInitialized && userInfo && userInfo.friends)
    {
      setContacts(userInfo.friends);
      setIsInitialized(true);
    }
  },[userInfo, isInitialized])
  //! you could construct the variables inside here and pass it to the function instead of the inverse of it
  const {
    searchRef,
    iconRef,
    resizeRef,
    searchState,
    setSearchState,
  } = useContactPanel(contactSection);
  
  // actions
  const handleSearch = async (event) => {
    setSearchState(event.target.value);
    console.log(event.target.value)
    if(event.target.value == "")
    {setContacts(userInfo.friends);}
    var {data:res, error:err} = await searchForUser(supabase, '2'+event.target.value,userInfo.friends);
    console.log(res, err);
    if(err)
    {
      console.log("Search error:", err);
      setContacts([]);
      return;
    }
    if(res == undefined || !Array.isArray(res) || res.length == 0)
      {setContacts([])}
    else
    {
      setContacts([...res]);
    }
    console.log(res)
    setSearchResult(0); 
  }; //! there is an unexpected rerender inspect it and continue search process
    const handleUnfocus = (e)=>{
      // // contacts = userInfo.friends;
      // console.log("unfocused")
      // console.log(userInfo.friends)
      // setSearchResult(1);
    }
  const handleChatSelect = async (event) =>{
    console.log(event.target)
    // try to get the thread with the target id if found this is a group else construct keys and get the DM
    if(threadData != null )
    {
      if( threadData.id == event.target.id)
      {
        console.log("abort")
        setScreenState(1);
        return
      }
    }
    else if(event.target.id == "")
    {
      console.log("abort")
      return
    }
    const {data:thread, error} = await getThreadGroup(supabase, event.target.id);
    console.log(thread, error);
    
    // Handle error case
    if(error)
    {
      console.log("Error fetching thread:", error);
      // Thread doesn't exist, create DM
      let keys = [userInfo.user_id, event.target.id]; // for DM
      const {data: threadFriend, error: errorFriend} = await getThreadFriend(supabase, keys);
      console.log(threadFriend);
      if(threadFriend && threadFriend.length > 0)
      {
        setThreadData(threadFriend[0]);
      }
     
      setScreenState(1);
      return;
    }
    
    if(thread && thread.length == 0)
    {
      console.log("DM")
      console.log(threadData)
      if(threadData?.Members != undefined)
      {
        if(threadData.Members.includes(userInfo.user_id, event.target.id))
        {
          console.log("already exists")
          setScreenState(1);
          return
        }
      }
      let keys = [userInfo.user_id, event.target.id]; // for DM
      const {data: threadFriend, error: errorFriend} = await getThreadFriend(supabase, keys);
      console.log(threadFriend);
      if(threadFriend && threadFriend.length > 0)
      {
        setThreadData(threadFriend[0]);
      }
    }
    else if(thread && thread.length > 0){
      setThreadData(thread[0]);
    }
    setScreenState(1);
  };
  
  return (
    <section id="contacts" ref={contactSection} > 
      <YourInfo />
      <div className="searchbar">
        <img src={searchIcon} alt="search" ref={iconRef} />
        <input
          type="text"
          ref={searchRef}
          placeholder="search"
          value={searchState}
          onChange={handleSearch}
          onBlur = {handleUnfocus}
        />
      </div>
      <div className="chats">
        {contacts.map((contact) => (
          <ContactListItem
            key={contact.user_id}
            id = {null}
            keys={contact.user_id}
            name={contact.name}
            lastMessage={"contact.lastMessage"}
            avatar={contact.imageUrl}
            clickHandler={handleChatSelect}
          />
        ))}
      </div>
      <div className="expander" ref={resizeRef}>⋮</div>
    </section>
  );
}

