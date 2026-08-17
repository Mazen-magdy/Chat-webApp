import { useState, useEffect, useContext } from "react";

import {supabaseClient} from '../contexts'

//components
import PhoneForm from "./SigninComponents/PhoneForm"
import VerifyForm from "./SigninComponents/Verify"
import Signup from "./SigninComponents/Signup";
import CreateAccount from "./SigninComponents/CreateAccount"

//styles
import "./signin.css"


export default function Enter()
{
    //states
    const [process, setProcess] = useState(4); // 0 signin, 1 verify, 2 signup, 3 createAccount, 4 choose signIn/signUp
    const [phone, setPhone] = useState("201016359580");
    const [operationType, setOperationType] = useState("");
    //handlers
    const operationHandler = (e)=>{
        if(e.target.name == "signIn")
        {
            setOperationType("signIn");
            setProcess(0);
        }
        else{
            setOperationType("signUp");
            setProcess(2);
        }
    }
    const render = () =>{
        if(process == 0)
        {
            return  <PhoneForm process= {process} setProcess = {setProcess} phone={phone} setPhone={setPhone} /> 
        }
        else if(process == 1)
        {
            return <VerifyForm phone = {phone} operation ={operationType} setProcess = {setProcess}/> 
        }
        else if(process == 2) 
        {
            return <Signup process= {process} setProcess = {setProcess} phone={phone} setPhone={setPhone}/>
        }
        else if(process == 3)
        {
            return <CreateAccount phone = {phone} />
        }
        else{
            return <div className="auth-choice">
                <div className="auth-card__brand"><span className="auth-card__brand-mark">C</span> Chatspace</div>
                <div className="auth-choice__content">
                    <p className="auth-card__eyebrow">Welcome</p>
                    <h1>Your conversations, all in one place.</h1>
                    <p>Stay in touch with the people who matter most.</p>
                </div>
                <div className="auth-choice__actions">
                    <button className="auth-choice__primary" name="signIn" onClick={operationHandler}>Sign in <span aria-hidden="true">→</span></button>
                    <button className="auth-choice__secondary" name="signUp" onClick={operationHandler}>Create an account</button>
                </div>
            </div>
            
        }
    }

    return(
        <div id="signinContainer">
            {render()}
        </div>
    )
}
