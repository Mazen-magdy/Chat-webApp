import { useState, useEffect, useContext } from "react";
//contexts
import {supabaseClient} from '../../contexts'
//styles
import "../signin.css"

async function signInHandler(supabase, phoneNumber, setProcess)
{
    console.log(phoneNumber); // debug
    const { data, error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
    })
    
    return {data, error}
}


export default function PhoneForm(props)
{
    //variables
    const process    = props.process;  
    const setProcess = props.setProcess;  
    const phone = props.phone;
    const setPhone = props.setPhone;
    //states
    const [error, setError] = useState(0);
    //contexts
    const supabase = useContext(supabaseClient);
    //handlers
    const phoneClickHandler = (e)=>{
        console.log(e)
        setPhone(e.target.value);
    }
    const onSubmitHandler = async (e)=>{
        e.preventDefault();
        const {data, error} = await signInHandler(supabase, phone, setProcess);
        console.log(data, error) // debug

        // state handler
        if(error)
        {
        console.log(error);
        }
        else
        {
            console.log(data); // debug
            if(!data.messageId)
                console.error("NotFound");
            else
            {
                setProcess(1); // go for verifying
            }
        }
    }
    return(
            <div className="auth-card">
                <div className="auth-card__brand"><span className="auth-card__brand-mark">C</span> Chatspace</div>
                <div className="auth-card__heading">
                    <p className="auth-card__eyebrow">Welcome back</p>
                    <h1>Sign in to your account</h1>
                    <p>Enter your phone number and we’ll send you a secure verification code.</p>
                </div>
                {Boolean(error) && <p className="errorMessage">Not found</p>}
                <form action="#" onSubmit={onSubmitHandler} className="auth-form sign">
                    <div className="auth-form__field">
                        <label htmlFor="phoneNumber" >Phone number</label>
                        <input type="tel" name="phoneNumber" id="phoneNumber" onChange={phoneClickHandler} value = {phone} placeholder="+20 101 635 9580" />
                    </div>
                    <button className="auth-form__submit" type="submit">Continue <span aria-hidden="true">→</span></button>
                </form>
                <p className="auth-card__note">We’ll only use this to keep your account secure.</p>
            </div>
    )
}
