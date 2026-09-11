import { useCallback, useContext, useRef, useState} from 'react'
import { Route , useNavigate } from 'react-router-dom';
//contexts
import {supabaseClient} from '../../contexts'
//libs
import { ClipLoader } from 'react-spinners';
async function verifyOTP(supabase, otp, email, operation, errorRef)
{
    console.log(email) //debug
    console.log(otp) //debug

    const {
    data: { session },
    error,
    } = await supabase.auth.verifyOtp({
    email: email,
    token: otp,
    type: 'email',
    })
    
    if(error)
    {
        console.log(error);
        errorRef.current.textContent = error.message;
        return [error, null]
    }
    else{

        console.log(session)
        const id = session.user.identities[0].user_id;
        const {data, error:fetcherror} = await supabase
        .from("user")
        .select()
        .eq("user_id", id);

        console.log(data, fetcherror)
        if(fetcherror)
        {
            return [fetcherror, null];
        }
        else if(data.length === 0)
        {
            return ["NotExists", session];
        }
        else{

            return["ok", session]
        }
    }
}

export default function VerifyForm(props)
{
    const navigate = useNavigate();
    //contexts
    const supabase = useContext(supabaseClient);
    //variables
    const email = props.email;
    const operation = props.operation;
    const setProcess = props.setProcess;
    //states
    const [otp, setOTP] = useState("");
    const [isLoading, setIsLoading] = useState(0);
    let errorref = useRef(null);
    //handlers
    const otpChangeHandler = (e)=>{
        setOTP(e.target.value)
    }
    const submitHandler = async (e)=>{
        e.preventDefault();
        setIsLoading(1);
        const [status, data] = await verifyOTP(supabase, otp, email, operation, errorref);
        console.log(status, data); 
        if(status == "ok")
        {
                // save access token
                localStorage.setItem("access-token", data.access_token);
                localStorage.setItem("id", data.user.id);
                // route to the dashboard
                navigate('../dashboard');

        }
        else if(status == "NotExists")
        {
            // save access token
            localStorage.setItem("access-token", data.access_token);
            localStorage.setItem("id", data.user.id);
            setProcess(3);
        }
        else
        {
            // throw an error
        }
        setIsLoading(0);
    }
    return(
        <div className="auth-card">
            <div className="auth-card__brand"><span className="auth-card__brand-mark">C</span> Chatspace</div>
            <div className="auth-card__heading">
                <p className="auth-card__eyebrow">One more step</p>
                <h1>Verify your number</h1>
                <p>Enter the 6-digit code sent to <strong>{email}</strong>.</p>
            </div>
            <form id="verify-otp" onSubmit={submitHandler} className="auth-form">
                <div className="auth-form__field">
                    <label htmlFor="OTP">Verification code</label>
                <input 
                type="text" 
                name="OTP"
                id="OTP"
                maxLength={8}
                inputMode='numeric'
                autoComplete='one-time-code'
                pattern='\d{8}'
                value={otp}
                onChange={otpChangeHandler}
                 />
                </div>
                 <button className="auth-form__submit" type='submit' disabled={isLoading} aria-busy={Boolean(isLoading)}>{ isLoading? <><ClipLoader /><span>Checking code...</span></> : <span aria-hidden="true">Verify code →</span>}</button>
            </form>
            <p className="auth-card__note">The code expires shortly for your security.</p>
            <p ref={errorref} style={{color : "red"}}></p>
        </div>
    )
}
