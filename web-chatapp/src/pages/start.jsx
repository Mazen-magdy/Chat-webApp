import QRCode from "react-qr-code"
import illustartion from '../utilities/Illustration.svg'
import './start.css'

import { useState, useEffect} from 'react';

console.log("MODE:", process.env);
console.log(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY)

export default function Start()
{
    console.log("login has been rendered")
    return(
        <div id="login">
            <div id="container">
                <img src={illustartion} alt="illustration" />
                <div> 
                    <h2>Login</h2>
                    <p>open your phone and go to settings then choose login then scan the QR code</p>
                </div>
                <QRCode value="https://customURL.com" />
            </div>
        </div>
    )
}