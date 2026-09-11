import { useContext, useState } from "react"
import { ThreadData } from "../../../contexts"
import ImgViewer from "../../../helperComponents/ImgViewer"

export default function ThreadInfo()
{
    const [threadData] = useContext(ThreadData)
    const [viewImgData, setViewImgData] = useState({state : 0, url : ""});
    if(!threadData?.id)
    {
        return null;
    }
     const handleImgClose = (e) =>{
        setViewImgData({state : 0, url : viewImgData.url});
    }
    const handleImgMagnify = (e) =>{
        setViewImgData({state : 1, url : e.target.getAttribute('src')});
    }
    const inputCopy = (e)=>{
        let value = e.target.getAttribute("placeholder").toString();
        navigator.clipboard.writeText(value)
        e.target.placeholder  = "Copied to clipboard";
        setTimeout(()=> { e.target.placeholder = value}, 1000)
    }
    return(
        <section id="ThreadInfo">
            <img src={threadData.imageUrl} onClick={handleImgMagnify} />
            <h1>{threadData.name}</h1>
            {
                {
                    Group: (
                    <div className="group-members">
                        <h1>Members</h1>
                        <ul>
                        <li>
                            <img src="#" alt="User avatar" onClick={handleImgMagnify} />
                            <h3>userName</h3>
                            <span>Admin</span>
                        </li>
                        </ul>
                    </div>
                    ),
                    DM: (
                    <div id="DMInfo">
                        <input type="text" placeholder={threadData?.Members[0]?.phoneNumber || "phoneNum doesn't exist"} onClick={inputCopy} readOnly />
                        <input type="text" placeholder={threadData?.Members[0]?.email || "Email doesn't exist"} onClick={inputCopy} readOnly />
                    </div>
                    ),
                }[threadData.Type] || null /* إضافة fallback لو النوع مش موجود */
            }
            <ImgViewer 
                isActive = {viewImgData.state}
                imgURL={viewImgData.url}
                onClose={handleImgClose}
            />
        </section>
    )
}