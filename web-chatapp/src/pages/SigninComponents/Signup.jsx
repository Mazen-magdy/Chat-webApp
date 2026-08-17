import { useState, useContext } from "react";
import { data } from "react-router-dom";
//contexts
import {supabaseClient} from '../../contexts'

async function signUp(supabase, datain)
{
    const { data, error } = await supabase.auth.signUp({
        phone: datain.phone,
        password: datain.pass,
        options: {
            datain: {
                first_name: datain.firstName,
                second_name: datain.secondName,
                email: datain.email,
            },
        },
    });
    console.log(data)
    return { data, error };
}


export default function Signup(props)
{
    //contexts
    const supabase = useContext(supabaseClient)
    //variables
    const phone = props.phone;
    const setPhone = props.setPhone;
    //states
    const [pass, setPass] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    //handlers
    const phoneChangeHandler = (e)=>{
        setPhone(e.target.value);
    }
    const passChangeHandler = (e)=>{
        setPass(e.target.value);
    }
    const onSubmit = async(e)=>{
        e.preventDefault()
        setErrorMessage("");
        setSuccessMessage("");

        const data =
        {
            pass : pass,
            phone : phone
        }
        const { data: authData, error } = await signUp(supabase, data);

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        if (!authData.user) {
            setErrorMessage("Could not create the account. Please try again.");
            return;
        }
        setSuccessMessage("Account created. Check your phone for the verification code.");
        props.setProcess(1);
    }
    
    return(
        <div className="auth-card">
            <div className="auth-card__brand"><span className="auth-card__brand-mark">C</span> Chatspace</div>
            <div className="auth-card__heading">
                <p className="auth-card__eyebrow">Create account</p>
                <h1>Join the conversation</h1>
                <p>Set up your account in just a moment.</p>
            </div>
            <form action="" onSubmit={onSubmit} className="auth-form">
                <div className="auth-form__field">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" value={pass} required minLength={6} placeholder="At least 6 characters" onChange={passChangeHandler}/>
                </div>
                <div className="auth-form__field">
                    <label htmlFor="phoneNumber">Phone number</label>
                    <input type="tel" name="phoneNumber" id="phoneNumber" value={phone} required placeholder="+201XXXXXXXXX" onChange={phoneChangeHandler}/>
                </div>
                <button className="auth-form__submit" type="submit">Create account <span aria-hidden="true">→</span></button>
            </form>
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            {successMessage && <p className="auth-card__success">{successMessage}</p>}

        </div>
    )
}
