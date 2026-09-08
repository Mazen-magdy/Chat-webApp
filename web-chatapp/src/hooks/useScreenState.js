import { useState, useEffect } from "react";
export default  function useScreenState (contact, chat, info, setInfoState, chatBackBtn, screenState, isLoading){
    let [isSmall, setIsSmall] = useState(() => window.innerWidth < 768);
    useEffect(()=>{
        if (!contact.current || !chat.current || !info.current || !chatBackBtn.current) return;
       
        if(isSmall)
        {
            console.log("small")
            //intiate
            contact.current.classList.add("disabled");
            chat.current.classList.add("disabled");
            info.current.classList.add("disabled");

            chatBackBtn.current.classList.remove('disabled');
            switch(screenState[0])
            {
                case 0:
                    contact.current.classList.remove("disabled");
                    chat.current.classList.add("disabled");
                    info.current.classList.add("disabled");
                    setInfoState(0);
                break;
                case 1:
                    contact.current.classList.add("disabled");
                    chat.current.classList.remove("disabled");
                    info.current.classList.add("disabled");
                    setInfoState(0);
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
            if(screenState[0] == 2)
            {
                info.current.classList.remove("disabled")
            }
            else{
                contact.current.classList.remove("disabled");
                chat.current.classList.remove("disabled");
                info.current.classList.add("disabled");
                chatBackBtn.current.classList.add('disabled');
            }
        }

        const handleResize = () => setIsSmall(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    },[isLoading, isSmall, screenState]);
}
