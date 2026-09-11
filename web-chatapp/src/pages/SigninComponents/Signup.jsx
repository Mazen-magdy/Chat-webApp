import { useState, useContext } from "react";
import { data } from "react-router-dom";
//contexts
import {supabaseClient} from '../../contexts'
//libs
import { ClipLoader } from "react-spinners";
async function signUp(supabase, datain)
{
    const { data, error } = await supabase.auth.signInWithOtp({
    email: datain.email,
    options: {
        shouldCreateUser: true,
    }
    })    
    console.log(data)
    return { data, error };
}


export default function Signup(props)
{
    //contexts
    const supabase = useContext(supabaseClient)
    //variables
    const email = props.email;
    const setEmail = props.setEmail;
    //states
    const [isLoading, setIsLoading] = useState(0);
    const [pass, setPass] = useState("159753");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    //handlers
    const emailChangeHandler = (e)=>{
        setEmail(e.target.value);
    }
    const passChangeHandler = (e)=>{
        setPass(e.target.value);
    }
    const onSubmit = async(e)=>{
        e.preventDefault()
        setIsLoading(1);
        setErrorMessage("");
        setSuccessMessage("");

        const data =
        {
            email : email,
            pass : pass,
        }
        const { data: authData, error } = await signUp(supabase, data);

        if (error) {
            setErrorMessage(error.message);
            setIsLoading(0);
            return;
        }

        // if (!authData.user) {
        //     setErrorMessage("Could not create the account. Please try again.");
        //     setIsLoading(0);
        //     return;
        // }
        setSuccessMessage("Account created. Check your email for the verification code.");
        props.setProcess(1);
        setIsLoading(0);
    }
    
    return(
        <div className="auth-card">
            <button> back </button>
            <div className="auth-card__brand"><span className="auth-card__brand-mark">C</span> Chatspace</div>
            <div className="auth-card__heading">
                <p className="auth-card__eyebrow">Create account</p>
                <h1>Join the conversation</h1>
                <p>Set up your account in just a moment.</p>
            </div>
            <form action="" onSubmit={onSubmit} className="auth-form">

                <div className="auth-form__field">
                    <label htmlFor="email">email</label>
                    <input type="email" name="email" id="email" value={email} required placeholder=""email onChange={emailChangeHandler}/>
                </div>
                <div className="auth-form__field">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" value={pass} required minLength={8} placeholder="At least 8 characters" onChange={passChangeHandler}/>
                </div>
                <button className="auth-form__submit" type="submit" disabled={isLoading} aria-busy={Boolean(isLoading)}>{isLoading? <><ClipLoader /><span>Creating account...</span></> : <span aria-hidden="true">Create account →</span>}</button>
            </form>
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            {successMessage && <p className="auth-card__success">{successMessage}</p>}

        </div>
    )
}
