import useScreenState from "./useScreenState";

function searchForThreadsInside(userInfo, payload){
    return userInfo.Threads.map((thread)=>{
        if(thread.name == payload)
            return thread;
    })
}
function filterUsers(id, users, buffer){
  
  console.log(users);
    let filteredusers = users.filter((user)=>{
      return !buffer.some((thread)=>{
        if(thread?.Members?.toString() == [id, user.user_id].toString() || thread?.Members?.toString() == [user.user_id, id].toString() )
        {
              return true;
        }
        return false;
      })
    })
    if(!filteredusers[0])
    {filteredusers = []}
    console.log(filteredusers);
    return filteredusers;
}
async function searchForThreads(supabase, payload){
    const {data, error} = await supabase
    .from("threads")
    .select("*")
    .ilike("name", `%${payload}%`)
    // .or("name.eq.dm")
    // .contains("name", payload)
    if(error)
    {
        console.log("error searching for threads inside threads");
        console.log(error);
    }
    console.log(data);
    return {data,error};
}

async function searchInsideUsers(supabase, payload){
    const{data, error} = await supabase
    .from("user")
    .select("name, user_id, phoneNumber, imageUrl")
    .ilike("name", `%${payload}%`)
    // .contains("name", payload)

    if(error)
    {
        console.log("error searching for users")
        console.log(error);
    }
    return {data,error};
}

async function getThreadFriend(supabase, keys)
{
  console.log(keys)
  const { data, error } = await supabase
  .from('threads')
  .select('*')
  .eq('Type', "DM")
  .contains("Members", keys)
  .containedBy('Members', keys);
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
async function getThread(supabase, id)
{
  if(id)
  {
    console.log(id)
    const { data, error } = await supabase
    .from('threads')
    .select('*')
    .eq("id", id);
    console.log(data, error);
    return {data, error};
  }
  else{
    let data = undefined;
    let error = "No id provided" 
    return {data, error};
  }
}

const  createSearhHandler =  (supabase, userInfo, setSearchResult, setIsLoadingSearch, setSearchState, setThreads) => async(event) =>{
    // functionsetIsLoadingSearch(1);
    setSearchState(event.target.value);
    if(event.target.value == "")
    {setThreads(userInfo.Threads); return;}
    //==================
    // body
    var threadsBuffer = []
  
    const {data, error} = await supabase
    .rpc('search_threads', { search_query: event.target.value });

    console.log(data, error)
    threadsBuffer.push(...data);
    let {data:users, errror:userError} = await searchInsideUsers(supabase, event.target.value);
    users = filterUsers(userInfo.user_id, users, data);
    threadsBuffer.push(...users);
    console.log(threadsBuffer)
    // render them in order
    setThreads(threadsBuffer);
    //==================

    setSearchResult(0); 
    setIsLoadingSearch(0);
}

const createChatSelectHandler = (supabase, userInfo, threads, threadData, setIsLoadingChat, screenState, setScreenState, setThreadData)=> async(event)=>{
  setIsLoadingChat(1);
  let thread;
  if(event.target.id == 0)
  {
    console.log("create new thread");
    let newThreadData = {
      name : "DM",
      Type : "DM",
      Members : [userInfo.user_id, event.currentTarget.dataset.id],
      created_by : userInfo.user_id,
    }
    console.log(newThreadData)
    const {data, error} = await supabase
    .from("threads")
    .insert(newThreadData)
    .select();
    console.log(data, error);
    console.log("get thread");
    
  }
  else
  {
    console.log("fetch thread");
    thread = threads.find((thread)=> thread.id == event.target.id)
  }
  setThreadData(thread);
  setScreenState([1, screenState[0]]);
  setIsLoadingChat(0);
}

export {getThread, getThreadFriend, getThreadGroup, createSearhHandler, createChatSelectHandler}