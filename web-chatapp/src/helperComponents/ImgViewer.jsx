import { createPortal } from "react-dom"
import closeIcon from "../utilities/close-circle-svgrepo-com.svg"
export default function({isActive, imgURL, onClose}){
    if(!isActive || !imgURL) return null; 
    const divStyle = {
        display: 'flex',
        width: '100%',
        flexDirection: 'col',
        justifyContent: 'center',
        position: 'absolute',
        height: '100%',
        zIndex: '100',
        top: '0',
        left: '0',
        alignContent: "center",
        alignItems: "center",
        background : "rgba(0,0,0,0.4)"
    }
    let imgStyle = {
        height : '95%',
    }
    if(window.innerWidth < 1500)
    {
        imgStyle = {
            width : '80%'
        }
    }
    const closeIconStyle = {
        width : '50px',
        cursor : 'pointer'
    }
    const btnStyle  ={
        position : "absolute",
        top:'0',
        right : '0',
        margin : '10px',
        borderRadius: '50%',
        border : 'none',
        width : '50px',
        height : '50px',
        textAlignment : 'center',
        background : 'none'
    }
    return createPortal(
        <div style={divStyle}>
            <button style={btnStyle} onClick={onClose}><img src={closeIcon} style={closeIconStyle} alt="close"/></button>
            <img src = {imgURL} style = {imgStyle} alt="magnified"/>
        </div>,
        document.body
    )
}