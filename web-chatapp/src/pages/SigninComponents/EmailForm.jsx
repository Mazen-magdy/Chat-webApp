import { useState, useEffect, useContext, useRef } from "react";
//contexts
import {supabaseClient} from '../../contexts'
//styles
import "../signin.css"
//libs
import {ClipLoader} from "react-spinners"
async function signInHandler(supabase, email, setProcess)
{
    console.log(email); // debug
    const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
            shouldCreateUser: true, 
        },
    })
    
    return {data, error}
}


export default function EmailForm(props)
{
    //variables
    const process    = props.process;  
    const setProcess = props.setProcess;  
    const email = props.email;
    const setEmail = props.setEmail;
    //states
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(0);
    //contexts
    const supabase = useContext(supabaseClient);
    //ref
    const LoginErr = useRef(null);
    //handlers
    const emailClickHandler = (e)=>{
        console.log(e)
        setEmail(e.target.value);
    }
    const onSubmitHandler = async (e)=>{
        e.preventDefault();
        setIsLoading(1);
        setError(null);
        const {data, error} = await signInHandler(supabase, email, setProcess);
        console.log(data, error) // debug

        // state handler
        if(error)
        {
         console.log(error);
         setError(error)
        }
        else
        {
            console.log(data); // debug
                setProcess(1); // go for verifying
        }
        setIsLoading(0);
    }
    return(
            <div className="auth-card">
                <button> back </button>
                <div className="auth-card__brand"><span className="auth-card__brand-mark">C</span> Chatspace</div>
                <div className="auth-card__heading">
                    <p className="auth-card__eyebrow">Welcome back</p>
                    <h1>Sign in to your account</h1>
                    <p>Enter your Email and we’ll send you a secure verification code.</p>
                </div>
                {Boolean(error) && <p className="errorMessage" role="alert">an error eoccured {error.message}</p>}
                <form action="#" onSubmit={onSubmitHandler} className="auth-form sign">
                    <div className="auth-form__field">
                        <label htmlFor="email" >Email</label>
                        <input type="tel" name="email" id="email" onChange={emailClickHandler} value = {email} placeholder="email" />
                    </div>
                    <button className="auth-form__submit" type="submit" disabled={isLoading} aria-busy={Boolean(isLoading)}>{(isLoading)? <><ClipLoader /><span>Sending code...</span></> : <span aria-hidden="true">Continue →</span>}</button>
                </form>
                <p className="auth-card__note">We’ll only use this to keep your account secure.</p>
            </div>
    )
}
