import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { usePopup } from '@vik_9827/popup';
import { decrypt, encrypt } from "@/lib/key";



interface Chat{
    name:string,
    message:string
}

export interface CompeteData{
    sendMessage:Function;
    competestate:string;
    setstate:Function;
    competestates:Array<string>;
    chat:Array<Chat>;
}


const Competecontext = createContext<CompeteData|undefined>(undefined);

export const CompeteProvider : React.FC<{children:ReactNode}> =({children})=>{
    const competestates = ["init", "middle", "end"]
    const {roomid, members, setmems, privatekey} = useSocket();
    const {connected, socket} = useSocket();
    const [chat, setchat] = useState<Array<Chat>>([]);
    const {pushPopup} = usePopup();
    const [competestate, setstate] = useState(competestates[0]);

    useEffect(()=>{
        if(connected && roomid){
            socket?.on(`${roomid}message`,async(data)=>{
                switch (data.type) {
                    case "chat":
                        if(privatekey){ 
                            const message = await decrypt(data.text,privatekey)
                            setchat((prev)=>[...prev,{message, name:data.name}]);
                        }
                        break;
                    case "joinroom":
                        setmems(data.members)
                        pushPopup(data.message);
                        break;
                    default:
                        break;
                }
            })

            return ()=>{
                socket?.off(`${roomid}message`)
            }
        }
    },[connected,roomid])

    const sendMessage =(msg:string)=>{
        if(connected){
            members.map(async({name, publickey})=>{
                console.log(publickey)
                const text = await encrypt(msg,publickey)
                socket?.emit(`roommessage`,{id:roomid,text,name});
            })
        }
    }

    return(
        <Competecontext.Provider
        value={{
            sendMessage,
            competestate,
            setstate,
            competestates,
            chat
        }}
        >
        {children}
        </Competecontext.Provider>
    )
}

export const useCompete = () => {
    const context = useContext(Competecontext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
