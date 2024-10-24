import { createContext, ReactNode, useContext, useEffect, useState, FC } from "react";
import { memsinfo, useSocket } from "./SocketContext";
import { usePopup } from '@vik_9827/popup/dist/bundle.js';
import { decrypt, encrypt, importPublicKey } from "@/lib/key";



export interface Chat{
    name:string,
    message:string
}

export interface CompeteData{
    sendMessage:Function;
    competestate:string;
    setstate:Function;
    competestates:Array<string>;
    chat:Array<Chat>;
    startMatch:Function;
    loading:boolean,
    reset:Function,
    text:string,
    duration:number|null,
    sendResult:Function,
    setloading:Function
}


const Competecontext = createContext<CompeteData|undefined>(undefined);

export const CompeteProvider : FC<{children:ReactNode}> =({children})=>{
    const competestates = ["init", "middle", "end"]
    const {roomid, members, setmems, privatekey, myname} = useSocket();
    const {connected, socket} = useSocket();
    const {pushPopup} = usePopup();
    const [chat, setchat] = useState<Array<Chat>>([]);
    const [competestate, setstate] = useState(competestates[0]);
    const [loading, setloading] = useState(false);
    const [text, settext] = useState("");
    const [duration, setduration] = useState<number|null>(null);

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
                        setmems((prev :[]) =>[...prev,data.newmem])
                        pushPopup(data.message);
                        break;
                    case "start":
                        setstate(competestate[1]);
                        settext(data.text);
                        setduration(data.duration);
                        break;
                    case "result":
                        {
                            if(!data.id || !data.points) return;
                            let arr = [...members];
                            for(let i=0;i<arr.length;i++){
                                if(arr[i].id === data.id){
                                    arr[i].points = data.points;
                                    break;
                                }
                            }
                            setmems(arr);
                        }
                        break;
                    case "left":
                        let arr = [...members];
                        for(let i=0;i<arr.length;i++){
                            if(arr[i].name === data.member){
                                arr.splice(i,1);
                                break;
                            }
                        }
                        setmems(arr);
                        pushPopup(data.message);
                        break;
                    default:
                        console.log(data)
                        break;
                }
            })

            socket?.on('disconnect', () => {
                reset();
            });

            return ()=>{
                socket?.off(`${roomid}message`)
            }
        }
    },[connected,roomid])

    const sendMessage =(msg:string)=>{
        try {
            if(connected){
                members.map(async({ publickey,id})=>{
                    const pkey:CryptoKey  = await importPublicKey(publickey);
                    const text = await encrypt(msg,pkey)
                    socket?.emit(`roommessage`,{id:roomid,sid:id,text,name:myname});
                
            })
        }
        } catch (error) {
            console.log(error);
            pushPopup("something went wrong");
        }
        }

    const sendResult =(wpm:number, raw_wpm:number, accuracy:number)=>{
        try {
            if(!connected) return;
            socket?.emit(`matchend`,{id:roomid,wpm,raw:raw_wpm,accuracy});
        } catch (error) {
            console.log(error);
            pushPopup("something went wrong");
        }
    }

    const startMatch =()=>{
        try {
            if(connected){
                socket?.emit(`startmatch`,{id:roomid});
            }
            setloading(true);
        } catch (error) {
            console.log(error);
            pushPopup("something went wrong");
        }
    }

    const reset =()=>{
        setchat([]);
        setstate(competestates[0]);
        setloading(false);
        settext("");
    }

    return(
        <Competecontext.Provider
        value={{
            sendMessage,
            competestate,
            setstate,
            competestates,
            chat,
            startMatch,
            loading,
            reset,
            text,
            duration,
            sendResult,
            setloading
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
}
