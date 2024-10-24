'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { LinearCongruentialGenerator } from "../../lib/lineargradientgenerator";
import { usePopup } from '@vik_9827/popup/dist/bundle.js';
import { exportPublicKey, Generatekey } from "@/lib/key";
import { useRouter } from "next/navigation";


interface Room {
    id: number;
    type: string;
    roomname: string;
    limit: number;
    mems: number;
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
    members: Array<memsinfo>;
    setmems: Function;
    myname: string;
    setmyname: Function;
    roomname: string;
    setroomid: Function;
    connecting: boolean;
}

export interface memsinfo {
    name: string;
    publickey: JsonWebKey;
    points: number;
    id: string;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [connected, setConnected] = useState(false);
    const [connecting, setconnecting] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const [create, setcreate] = useState(false);
    const { pushPopup } = usePopup();
    const [privatekey, setprivatekey] = useState<CryptoKey | null>(null);
    const [publickey, setpublickey] = useState<JsonWebKey | null>(null);
    const [roomid, setroomid] = useState<number | null>(null);
    const [members, setmems] = useState<memsinfo[]>([]);
    const router = useRouter();
    const [myname, setmyname] = useState("");
    const [roomname, setroomname] = useState("");

    useEffect(() => {
        const initSocket = async () => {
            try {
                const URL = process.env.NEXT_PUBLIC_SOCKET_URL;
                if (!URL) {
                    pushPopup("something went wrong with URL");
                    return;
                }
                setconnecting(true);
                const socket: Socket = io(URL);
                socketRef.current = socket;
                if (!socket) return;
                try {
                    const key = await Generatekey();
                    const pkey = await exportPublicKey(key.publicKey);
                    setprivatekey(key.privateKey);
                    setpublickey(pkey);
                } catch (error) {
                    if (error instanceof TypeError) {
                        throw new Error(error.message);
                    } else {
                        pushPopup("something went wrong during key generation");
                    }
                }

                socket.on('connect', () => {
                    setconnecting(false);
                    setConnected(true);
                    socket.io.engine.on('upgrade', (transport) => {
                        console.log(`Transport upgraded to ${transport.name}`);
                    });
                });

                socket.on('reconnect_attempt', () => {
                    setconnecting(true);
                    console.log('attempting to reconnect');
                });

                socket.on('reconnect_failed', () => {
                    setconnecting(false);
                    console.log('failed to reconnect');
                });

                socket.on('disconnect', () => {
                    setconnecting(false);
                    setConnected(false);
                    LeaveGroup();
                    router.replace("/compete")
                });

                return () => {
                    socket.off('connect');
                    socket.off('disconnect');
                };
            } catch (error) {
                pushPopup('something went wrong with socket connection');
            }
        };

        initSocket();
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
    }, [roomid, myname]);

    useEffect(() => {
        if (connected) {
            const handleMessage = (data: any) => {
                switch (data.type) {
                    case 'error':
                        pushPopup(data.error);
                        break;
                    case 'CREATEROOM':
                        router.replace(`/match/id`);
                        setmems(data.memslist);
                        setroomid(data.id);
                        pushPopup(data.message);
                        setmyname(data.memslist[0].name);
                        setroomname(data.roomname);
                        break;
                    case 'JOINROOM':
                        router.replace(`/match/id`);
                        setroomid(data.id);
                        setmems(data.members);
                        pushPopup(data.message);
                        setmyname(data.name);
                        setroomname(data.roomname);
                        break;
                    case 'GETROOMS':
                        setRooms(data.rooms);
                        break;
                    default:
                        console.log("Unknown message type:", data.type);
                }
            };

            socketRef.current?.on('message', handleMessage);
            return () => {
                socketRef.current?.off('message', handleMessage);
            };
        }
    }, [connected, pushPopup, router]);

    const JoinGroup = (id: number, name: string, code: number) => {
        if (!connected) return;
        if (socketRef.current) {
            socketRef.current.emit('JOINROOM', { id, name, code, publickey });
        }
    };

    const CreateGroup = (name: string, roomname: string, limit: number, type: string, text: string, duration: number) => {
        if (!connected) return;
        if (socketRef.current) {
            const code = LinearCongruentialGenerator(Date.now());
            const data = { name, roomname, limit, type, code, publickey, text, duration };
            socketRef.current.emit('CREATEROOM', data);
        }
    };

    const LeaveGroup = () => {
        if (!connected) return;
        if (socketRef.current && roomid && myname) {
            socketRef.current.emit('LEAVEROOM', { id: roomid, name: myname });
        }
    };

    const sendResult = (wpm: number) => {
        if (!connected) return;
        if (socketRef.current) {
            socketRef.current.emit('WPM', { wpm });
        }
    };

    const getGroups = () => {
        if (!connected) return;
        if (socketRef.current) {
            socketRef.current.emit('GETROOMS');
        }
    };


    
    return (
        <SocketContext.Provider value={{
            setroomid, roomname, myname, setmyname, members, setmems, socket: socketRef.current, connecting, 
            connected, JoinGroup, LeaveGroup, CreateGroup, sendResult, getGroups, rooms, create, setcreate, privatekey, publickey, roomid
        }}>
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
