'use client';
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { LinearCongruentialGenerator } from "../api/compete/route";
import { usePopup } from '@vik_9827/popup';
import { Generatekey } from "@/lib/key";
import { useRouter } from "next/navigation";

interface Room {
    id: number;
    type: string;
    roomname:string;
    limit:number;
    mems:number
}

export interface SocketContextType {
    socket: Socket | null;
    connected: boolean;
    JoinGroup: (id: number, name: string, code: number) => void;
    LeaveGroup: (id: number, name: string) => void;
    CreateGroup: (name:string,roomname:string, limit: number, type: string) => void;
    sendResult: (wpm: number) => void;
    getGroups: () => void;
    rooms: Array<Room>;
    create:boolean;
    setcreate:Function;
    privatekey:CryptoKey|null;
    publickey:CryptoKey|null;
    roomid:number|null;
    members:Array<memsinfo>,
    setmems:Function
}

interface memsinfo{
    name:string,
    publickey:CryptoKey,
    points:number
}


const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [connected, setConnected] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const [create, setcreate] = useState(false);
    const { pushPopup } = usePopup();
    const [privatekey, setprivatekey] = useState<CryptoKey|null>(null);
    const [publickey, setpublickey] = useState<CryptoKey|null>(null);
    const [roomid, setroomid] = useState<number|null>(null);
    const [members, setmems] = useState<Array<memsinfo>>([]); 
    const router = useRouter();

    useEffect(() => {
        try {
            const URL = process.env.NEXT_PUBLIC_SOCKET_URL ;
            if(!URL){
                pushPopup("something went wrong with url");
                return;
            }
            const socket: Socket = io(URL);
            socketRef.current = socket;

            (async()=>{
                try {
                    const key = await Generatekey();
                    setprivatekey(key.privateKey);
                    setpublickey(key.publicKey);
                } catch (error){
                    if(error instanceof TypeError){
                        throw new Error(error.message);
                    }else{
                        pushPopup("something went wrong");
                    }
                }
            })()

            const handleConnection = () => {
                setConnected(true);
                socket.io.engine.on('upgrade', (transport) => {
                    console.log(`Transport upgraded to ${transport.name}`);
                });
            };

            const handleDisconnection = () => {
                setConnected(false);
            };

            socket.on('connect', handleConnection);
            socket.on('disconnect', handleDisconnection);

            return () => {
                socket.off('connect', handleConnection);
                socket.off('disconnect', handleDisconnection);
            };
        } catch (error) {
            pushPopup('something went wrong')
        }
    }, []);

    useEffect(() => {
        if (connected) {
            socketRef.current?.on('message', (data) => {
                switch (data.type) {
                    case 'error':
                        pushPopup(data.error);
                        break;
                    case 'CREATEROOM':
                        router.replace(`compete/${data.id}`);
                        setroomid(data.id)
                        pushPopup(data.message);
                        break;
                    case 'JOINROOM':
                        router.replace(`compete/${data.id}`);
                        setroomid(data.id)
                        setmems(data.members)
                        pushPopup(data.message);
                        break;
                    case 'GETROOMS':
                        setRooms(data.rooms);
                        break;
                    default:
                        console.log(data.type === "JOINROOM");
                }
            });

            return () => {
                socketRef.current?.off('message');
            };
        }
    }, [connected, pushPopup]);

    const JoinGroup = (id: number, name: string, code: number) => {
        if (socketRef.current) {
            socketRef.current.emit('JOINROOM', { id, name, code, publickey });
        }
    };

    const CreateGroup = (name:string, roomname:string, limit: number, type: string) => {
        if (socketRef.current) {
            console.log(name)
            const code = LinearCongruentialGenerator(Date.now());
            const data = { name, roomname, limit, type, code, publickey };
            socketRef.current.emit('CREATEROOM', data);
        }
    };

    const LeaveGroup = (id: number, name: string) => {
        if (socketRef.current) {
            socketRef.current.emit('LEAVEROOM', { id, name });
        }
    };

    const sendResult = (wpm: number) => {
        if (socketRef.current) {
            socketRef.current.emit('WPM', { wpm });
        }
    };

    const getGroups = () => {
        if (socketRef.current) {
            socketRef.current.emit('GETROOMS');
        }
    };

    return (
        <SocketContext.Provider value={{members, setmems, socket: socketRef.current, connected, JoinGroup, LeaveGroup, CreateGroup, sendResult, getGroups, rooms, create , setcreate, privatekey, publickey, roomid }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
