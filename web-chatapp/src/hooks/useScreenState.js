import { useState, useEffect } from "react";
export default  function useScreenState (contact, chat, info, chatBackBtn, screenState){
    let [isSmall, setIsSmall] = useState(() => window.innerWidth < 768);
    useEffect(()=>{
        if (!contact.current || !chat.current || !info.current || !chatBackBtn.current) return;

        if(isSmall)
        {
            chatBackBtn.current.classList.remove('disabled');
            switch(screenState)
            {
                case 0:
                    contact.current.classList.remove("disabled");
                    chat.current.classList.add("disabled");
                    info.current.classList.add("disabled");
                break;
                case 1:
                    contact.current.classList.add("disabled");
                    chat.current.classList.remove("disabled");
                    info.current.classList.add("disabled");
                break;
                case 2:
                    contact.current.classList.add("disabled");
                    chat.current.classList.add("disabled");
                    info.current.classList.remove("disabled");
                break;
                default:
                    console.error("screen Handler not working.");
                break;
            }
        }
        else{
            contact.current.classList.remove("disabled");
            chat.current.classList.remove("disabled");
            chatBackBtn.current.classList.add('disabled');
        }

        const handleResize = () => setIsSmall(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    },[isSmall, screenState]);
}
