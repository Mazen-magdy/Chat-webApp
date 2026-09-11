import {useState, useContext} from "react"
import {supabaseClient} from "../../../contexts"
import {createChangeImgHandler} from "../../../hooks/edit"
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
export default function Edit({userInfo, setUserInfo})
{
   const navigate = useNavigate();
  const supabase = useContext(supabaseClient);
  const [isLoadingImg, setIsLoadingImg] = useState(0);
  const [isSignout, setIsSignout] = useState(0);
  const changeImg = createChangeImgHandler(supabase,userInfo, setUserInfo, setIsLoadingImg); 
    // const changeName = createChangeImgHandler(supabase); 
    // const changeEmail = createChangeImgHandler(supabase); 
  const signOutHandler = async ()=>{
    setIsSignout(1);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error.message);
      }
    } finally {
      localStorage.removeItem("access-token");
      localStorage.removeItem("id");
      setUserInfo(null);
      navigate("/enter", { replace: true });
      setIsSignout(0);
    }
  }
    return(
      <>
                  {
                    isLoadingImg? <ClipLoader />: <div className="profile-image" >
                    <input type="file" accept="image/*" onChange={changeImg}/>
                    <img src={userInfo?.imageUrl} alt="profile" />
                  </div>
                  }
        
                  <div className="info-details">
                    <div className="info-item">
                      <label>Name</label>
                      <p>{userInfo?.name}</p>
                    </div>
        
                    <div className="info-item">
                      <label>Phone</label>
                      <p>{userInfo?.phoneNumber}</p>
                    </div>
        
                    <div className="info-item">
                      <label>Email</label>
                      <p>{userInfo?.email || "Not provided"}</p>
                    </div>
                  </div>
                  <button id="signout" onClick={signOutHandler} disabled={isSignout}>{isSignout? <ClipLoader /> : "SignOut"}</button>
      </>
    )
}