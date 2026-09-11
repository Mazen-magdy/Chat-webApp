import { useState, useContext, useRef } from "react";
import { data, useNavigate } from "react-router-dom";
//contexts
import {supabaseClient} from '../../contexts'
//libs
import { ClipLoader, ClockLoader } from "react-spinners";

async function createAcc(supabase, datain)
{
    console.log(datain) // debug
    // send the profile image and get the URL for it
    const ext = datain.profile.name.split('.').pop();
    const fileName = `${Math.random()}.${ext}`;
    const filePath = `uploads/${fileName}`;
        // save image
    const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('ProfileImages')
    .upload(filePath, datain.profile);  
    console.log(uploadData, uploadError);
        // fetch url
    const { data: profileImageData } = supabase
    .storage
    .from('ProfileImages')
    .getPublicUrl(filePath);
    const imageUrl = profileImageData.publicUrl;
    // create the Account
    const { error } = await supabase
    .from('user')
    .insert({
            user_id: datain.id,
            name: datain.name,
            phoneNumber: datain.phone,
            email: datain.email,
            imageUrl: imageUrl,
    })
    return error;
}



export default function CreateAccount(props){
    const navigate = useNavigate();
    //contexts
    const supabase = useContext(supabaseClient)
    //states
    const [isLoading, setIsLoading] = useState(0);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [profile_img, setProfile_img] = useState(null);
    //ref
    const creatAcc_err = useRef(null);
    //handlers
    const nameChangeHandler = (e)=>{
        setName(e.target.value);
    }
    const phoneChangeHandler = (e)=>{
        setPhone(e.target.value);
    }
    const profileChangeHandler = (e)=>{
        console.log(e.target);
        setProfile_img(e.target.files[0]);
    }
    const submission = async (e)=>{
        e.preventDefault();
        setIsLoading(1);
         const data = {
            id : localStorage.getItem("id"),
            name : name,
            email : props.email,
            phone : phone,
            profile : profile_img
        }
        const status = await createAcc(supabase, data);
        if(!status)
        {
            navigate('../dashboard')
        }
        else{
            console.log(creatAcc_err.current)
            creatAcc_err.current.textContent = status.message;
            creatAcc_err.current.classList.remove("disabled");
        }
        console.log(status); // debug
        setIsLoading(0);
    }
    return(
        <div className="auth-card">
            <button> back </button>
            <div className="auth-card__brand"><span className="auth-card__brand-mark">C</span> Chatspace</div>
            <div className="auth-card__heading">
                <p className="auth-card__eyebrow">Almost there</p>
                <h1>Complete your profile</h1>
                <h3 className="errorMes disabled" ref={creatAcc_err} role="alert">Error</h3>
                <p>Add a few details so your friends can recognize you.</p>
            </div>
            <form action="" onSubmit={submission} className="auth-form">
                <div className="auth-form__field">
                    <label htmlFor="firstname">Full name</label>
                    <input type="text" name="firstname" id="firstname" value={name} required placeholder="Your full name" onChange={nameChangeHandler} />
                </div>
                <div className="auth-form__field">
                    <label htmlFor="phone">PhoneNumber</label>
                    <input type="tel" name="phone" id="phone" value={phone} required placeholder="+xx xxx..." onChange={phoneChangeHandler}/>
                </div>
                <div className="auth-form__field">
                    <label htmlFor="profileImg" value={profile_img} >Profile picture</label>
                    <input className="auth-form__file" type="file" name="profile_img" id="profileImg" onChange={profileChangeHandler}/>
                </div>
                <button className="auth-form__submit" type="submit" disabled={isLoading} aria-busy={Boolean(isLoading)}>{ isLoading? <><ClipLoader /><span>Saving profile...</span></>:<span aria-hidden="true">Finish setup →</span>}</button>
            </form>
        </div>
    )
}
