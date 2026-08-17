import { useCallback, useContext, useState} from 'react'
import { Route , useNavigate } from 'react-router-dom';
//contexts
import {supabaseClient} from '../../contexts'

async function verifyOTP(supabase, otp, phone)
{
    console.log(phone) //debug
    const {
    data: { session },
    error,
    } = await supabase.auth.verifyOtp({
    phone: phone,
    token: otp,
    type: 'sms',
    })
    
    if(error)
    {
        console.log(error);
        return [error, null]
    }
    else{

        console.log(session)
        return["ok", session]
    }
}

export default function VerifyForm(props)
{
    const navigate = useNavigate();
    //contexts
    const supabase = useContext(supabaseClient);
    //variables
    const phone = props.phone;
    const operation = props.operation;
    const setProcess = props.setProcess;
    //states
    const [otp, setOTP] = useState("");
    //handlers
    const otpChangeHandler = (e)=>{
        setOTP(e.target.value)
    }
    const submitHandler = async (e)=>{
        e.preventDefault();
        const [status, data] = await verifyOTP(supabase, otp, phone);
        console.log(status, data); 
        if(status == "ok")
        {
            if(operation == "signIn")
            {

                // save access token
                localStorage.setItem("access-token", data.access_token);
                localStorage.setItem("id", data.user.id);
                // route to the dashboard
                navigate('../dashboard');
            }
            else{
                localStorage.setItem("id", data.user.id);
                setProcess(3);
            }
        }
        else
        {
            // throw an error
        }
    }
    return(
        <div className="auth-card">
            <div className="auth-card__brand"><span className="auth-card__brand-mark">C</span> Chatspace</div>
            <div className="auth-card__heading">
                <p className="auth-card__eyebrow">One more step</p>
                <h1>Verify your number</h1>
                <p>Enter the 6-digit code sent to <strong>{phone}</strong>.</p>
            </div>
            <form id="verify-otp" onSubmit={submitHandler} className="auth-form">
                <div className="auth-form__field">
                    <label htmlFor="OTP">Verification code</label>
                <input 
                type="text" 
                name="OTP"
                id="OTP"
                maxLength={6}
                inputMode='numeric'
                autoComplete='one-time-code'
                pattern='\d{6}'
                value={otp}
                onChange={otpChangeHandler}
                 />
                </div>
                 <button className="auth-form__submit" type='submit'>Verify code <span aria-hidden="true">→</span></button>
            </form>
            <p className="auth-card__note">The code expires shortly for your security.</p>
        </div>
    )
}
