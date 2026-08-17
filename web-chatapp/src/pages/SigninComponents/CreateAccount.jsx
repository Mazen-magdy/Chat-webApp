import { useState, useContext } from "react";
import { data, useNavigate } from "react-router-dom";
//contexts
import {supabaseClient} from '../../contexts'


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
    .from('your-bucket-name')
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
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [profile_img, setProfile_img] = useState(null);
    //handlers
    const nameChangeHandler = (e)=>{
        setName(e.target.value);
    }
    const emailChangeHandler = (e)=>{
        setEmail(e.target.value);
    }
    const profileChangeHandler = (e)=>{
        console.log(e.target);
        setProfile_img(e.target.files[0]);
    }
    const submission = async (e)=>{
        e.preventDefault();
         const data = {
            id : localStorage.getItem("id"),
            name : name,
            email : email,
            phone : props.phone,
            profile : profile_img
        }
        const status = await createAcc(supabase, data);
        if(!status)
        {
           
            navigate('../dashboard')
        }
        else{
            // througth an error
        }
        console.log(status); // debug
    }
    return(
        <div className="auth-card">
            <div className="auth-card__brand"><span className="auth-card__brand-mark">C</span> Chatspace</div>
            <div className="auth-card__heading">
                <p className="auth-card__eyebrow">Almost there</p>
                <h1>Complete your profile</h1>
                <p>Add a few details so your friends can recognize you.</p>
            </div>
            <form action="" onSubmit={submission} className="auth-form">
                <div className="auth-form__field">
                    <label htmlFor="firstname">Full name</label>
                    <input type="text" name="firstname" id="firstname" value={name} required placeholder="Your full name" onChange={nameChangeHandler} />
                </div>
                <div className="auth-form__field">
                    <label htmlFor="email">Email address</label>
                    <input type="email" name="email" id="email" value={email} required placeholder="you@example.com" onChange={emailChangeHandler}/>
                </div>
                <div className="auth-form__field">
                    <label htmlFor="profileImg" value={profile_img} >Profile picture</label>
                    <input className="auth-form__file" type="file" name="profile_img" id="profileImg" onChange={profileChangeHandler}/>
                </div>
                <button className="auth-form__submit" type="submit">Finish setup <span aria-hidden="true">→</span></button>
            </form>
        </div>
    )
}
