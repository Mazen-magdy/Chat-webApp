import {useContext, useState, useRef, useEffect} from 'react';

// hooks
import { useContactPanel } from '../../hooks/useContactPanel';

// contexts
import {screenSt, ThreadData, userData, supabaseClient} from "../../contexts";

// Components
import YourInfo from "./ContactComponents/YourInfo";

// hooks
import {  getThread, getThreadFriend, getThreadGroup, createSearhHandler, createChatSelectHandler } from '../../hooks/contacts';

// utils
import searchIcon from '../../utilities/search.svg';
import User1 from '../../utilities/user1.jpg';
import ContactListItem from './ContactListItem';
import { data } from 'react-router-dom';



export default function Contact(props) {
  //props extraction
  const {contactSection} = props;
  //states
  const [isLoadingSearch, setIsLoadingSearch] = useState(0);
  const [isLoadingChat, setIsLoadingChat] = useState(0);
  const [searchResults, setSearchResult] = useState(0);
  const [threads, setThreads] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  // ref
  let contactsRef = useRef([
  ]);
  // context variables
  const {screenState, setScreenState} = useContext(screenSt);
  const [threadData, setThreadData] = useContext(ThreadData);
  const [userInfo, setUserInfo] = useContext(userData);
  const supabase = useContext(supabaseClient);
  // handlers
  useEffect(()=>{
    // Only initialize contacts on first load
    if(!isInitialized && userInfo && userInfo.friends)
    {
      if(userInfo.Threads[0] != null) setThreads(userInfo.Threads);
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
  const handleSearch =  createSearhHandler(supabase, userInfo, setSearchResult, setIsLoadingSearch, setSearchState, setThreads) //! there is an unexpected rerender inspect it and continue search process

  const handleChatSelect = createChatSelectHandler(supabase, userInfo, threads, threadData, setIsLoadingChat, screenState, setScreenState, setThreadData);
  
  return (
    <section id="contacts" ref={contactSection} > 
      <YourInfo />
      <div className="searchbar">
        <img src={searchIcon} alt="search" ref={iconRef} />
        {isLoadingSearch ? <span className="search-loading" role="status">Searching...</span> : null}
        <input
          type="text"
          ref={searchRef}
          placeholder="search"
          aria-label="Search contacts by phone number"
          value={searchState}
          onChange={handleSearch}
        />
      </div>
      {isLoadingChat ? <div className="selection-loading" role="status"><span className="state-spinner" aria-hidden="true" />Opening conversation...</div> : null}
      <div className="chats">
        {!isInitialized ? <div className="state-message" role="status"><span className="state-spinner" aria-hidden="true" />Loading your contacts...</div> : threads?.length? threads.map((thread) => (
          <ContactListItem
            id = {thread?.user_id? 0 :thread.id}
            user_id = {(thread?.user_id)? thread.user_id : ""}
            name={thread.name || "Unnamed contact"}
            lastMessage={thread.lastMessage || "Start a conversation"}
            avatar={thread.imageUrl}
            clickHandler={handleChatSelect}
          />
        )) : <div className="state-message">{isLoadingSearch ? <><span className="state-spinner" aria-hidden="true" />Searching contacts...</> : "No contacts yet"}</div>}
      </div>
      <div className="expander" ref={resizeRef}>⋮</div>
    </section>
  );
}

