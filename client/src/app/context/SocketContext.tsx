'use client';
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { LinearCongruentialGenerator } from "../api/compete/route";
import { usePopup } from '@vik_9827/popup';
import { exportPublicKey, Generatekey } from "@/lib/key";
import { useRouter } from "next/navigation";

interface Room {
    id: number;
    type: string;
    roomname: string;
    limit: number;
    mems: number
}

export interface SocketContextType {
    socket: Socket | null;
    connected: boolean;
    JoinGroup: (id: number, name: string, code: number) => void;
    LeaveGroup: () => void;
    CreateGroup: (name: string, roomname: string, limit: number, type: string, text: string, duration: number) => void;
    sendResult: (wpm: number) => void;
    getGroups: () => void;
    rooms: Array<Room>;
    create: boolean;
    setcreate: Function;
    privatekey: CryptoKey | null;
    publickey: JsonWebKey | null;
    roomid: number | null;
    members: Array<memsinfo>,
    setmems: Function,
    myname: string,
    setmyname: Function,
    roomname: string,
    setroomid: Function
}

export interface memsinfo {
    name: string,
    publickey: JsonWebKey,
    points: number,
    id: string
}


const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [connected, setConnected] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const [create, setcreate] = useState(false);
    const { pushPopup } = usePopup();
    const [privatekey, setprivatekey] = useState<CryptoKey | null>(null);
    const [publickey, setpublickey] = useState<JsonWebKey | null>(null);
    const [roomid, setroomid] = useState<number | null>(null);
    const [members, setmems] = useState<Array<memsinfo>>([]);
    const router = useRouter();
    const [myname, setmyname] = useState("");
    const [roomname, setroomname] = useState("");

    useEffect(() => {
        try {
            const URL = process.env.NEXT_PUBLIC_SOCKET_URL;
            if (!URL) {
                pushPopup("something went wrong with url");
                return;
            }
            const socket: Socket = io(URL);
            socketRef.current = socket;

            (async () => {
                try {
                    const key = await Generatekey();
                    const pkey = await exportPublicKey(key.publicKey);
                    setprivatekey(key.privateKey);
                    setpublickey(pkey);
                } catch (error) {
                    if (error instanceof TypeError) {
                        throw new Error(error.message);
                    } else {
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
        const handleBeforeUnload = () => {
            if (socketRef.current && roomid && myname) {
                socketRef.current.emit('LEAVEROOM', { id: roomid, name: myname });
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [roomid, myname, socketRef]);

    useEffect(() => {
        if (connected) {
            socketRef.current?.on('message', (data) => {
                switch (data.type) {
                    case 'error':
                        pushPopup(data.error);
                        break;
                    case 'CREATEROOM':
                        router.replace(`/match/${data.id}`);
                        setmems(data.memslist)
                        setroomid(data.id)
                        pushPopup(data.message);
                        setmyname(data.memslist[0].name);
                        setroomname(data.roomname);
                        break;
                    case 'JOINROOM':
                        router.replace(`/match/${data.id}`);
                        setroomid(data.id)
                        setmems(data.members)
                        pushPopup(data.message);
                        setmyname(data.name);
                        setroomname(data.roomname);
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

    const CreateGroup = (name: string, roomname: string, limit: number, type: string, text: string, duration: number) => {
        if (socketRef.current) {
            const code = LinearCongruentialGenerator(Date.now());
            console.log(duration)
            const data = { name, roomname, limit, type, code, publickey, text, duration };
            socketRef.current.emit('CREATEROOM', data);
        }
    };

    const LeaveGroup = () => {
        console.log('leaving')
        if (socketRef.current && roomid && myname) {
            socketRef.current.emit('LEAVEROOM', { id: roomid, name: myname });
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
        <SocketContext.Provider value={{setroomid, roomname, myname, setmyname, members, setmems, socket: socketRef.current, connected, JoinGroup, LeaveGroup, CreateGroup, sendResult, getGroups, rooms, create, setcreate, privatekey, publickey, roomid }}>
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
