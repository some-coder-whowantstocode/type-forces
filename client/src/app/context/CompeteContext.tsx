import { createContext, ReactNode, useContext, useEffect, useState, FC } from "react";
import { memsinfo, useSocket } from "./SocketContext";
import { usePopup } from '@vik_9827/popup/dist/bundle.js';
import { decrypt, encrypt, importPublicKey } from "@/lib/key";



export interface Chat {
    name: string,
    message: string
}

export interface CompeteData {
    sendMessage: Function;
    competestate: string;
    setstate: Function;
    competestates: Array<string>;
    chat: Array<Chat>;
    startMatch: Function;
    loading: boolean,
    reset: Function,
    text: string,
    duration: number,
    sendResult: Function,
    setloading: Function
}


const Competecontext = createContext<CompeteData | undefined>(undefined);

export const CompeteProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const competestates = ["init", "middle", "end"]
    const { roomid, members, setmems, privatekey, myname } = useSocket();
    const { connected, socket } = useSocket();
    const { pushPopup } = usePopup();
    const [chat, setchat] = useState<Array<Chat>>([]);
    const [competestate, setstate] = useState(competestates[0]);
    const [loading, setloading] = useState(false);
    const [text, settext] = useState("");
    const [duration, setduration] = useState<number >(0);

    useEffect(() => {
        if (connected && roomid) {
            socket?.on(`${roomid}message`, async (data) => {
                console.log(data)
                try {
                    
                switch (data.type) {
                    case "chat":
                        if (privatekey) {
                            const message = await decrypt(data.text, privatekey)
                            setchat((prev) => [...prev, { message, name: data.name }]);
                        }
                        break;
                    case "joinroom":
                        const mems = [...members];
                        mems.push(data.newmem);
                        setmems(mems);
                        break;
                    case "start":
                        setstate(competestate[1]);
                        settext(data.text);
                        setduration(data.duration);
                        break;
                    case "result":
                        {
                            if (!data.list) return;
                            data.list.sort((a:memsinfo, b:memsinfo) => {
                                if (a.points.w === b.points.w) {
                                    if (a.points.r === b.points.r) {
                                        return b.points.a - a.points.a; 
                                    }
                                    return b.points.r - a.points.r; 
                                }
                                return b.points.w - a.points.w; 
                            });
                            setmems(data.list);
                        }
                        break;
                    case "left":
                        let arr = [...members];
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].name === data.member) {
                                arr[i].active = false;
                                break;
                            }
                        }
                        setmems(arr);
                        break;
                    default:
                        console.log(data)
                        break;
                }
            } catch (error) {
                console.log(error)
            }
            })

            socket?.on('disconnect', () => {
                reset();
            });

            return () => {
                socket?.off(`${roomid}message`)
                socket?.off('disconnect')
            }
        }
    }, [connected, roomid,members])

    const sendMessage = (msg: string) => {
        try {
            if (connected) {
                members.map(async ({ publickey, id }) => {
                    const pkey: CryptoKey = await importPublicKey(publickey);
                    const text = await encrypt(msg, pkey)
                    socket?.emit(`roommessage`, { id: roomid, sid: id, text, name: myname });

                })
            }
        } catch (error) {
            console.log(error);
            pushPopup("something went wrong");
        }
    }

    const sendResult = (wpm: number, raw_wpm: number, accuracy: number) => {
        try {
            if (!connected) return;
            socket?.emit(`matchend`, { id: roomid, wpm, raw: raw_wpm, accuracy });
        } catch (error) {
            console.log(error);
            pushPopup("something went wrong");
        }
    }

    const startMatch = () => {
        try {
            if (connected) {
                socket?.emit(`startmatch`, { id: roomid });
            }
            setloading(true);
        } catch (error) {
            console.log(error);
            pushPopup("something went wrong");
        }
    }

    const reset = () => {
        setchat([]);
        setstate(competestates[0]);
        setloading(false);
        settext("");
    }

    return (
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
