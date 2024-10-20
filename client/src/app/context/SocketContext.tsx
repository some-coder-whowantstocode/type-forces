'use client';
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { LinearCongruentialGenerator } from "../api/compete/route";
import { usePopup } from '@vik_9827/popup';

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
    CreateGroup: (name:string,roomname:string, limit: number, type: string, numbers: boolean, symbols: boolean, duration: number, text: string) => void;
    sendResult: (wpm: number) => void;
    getGroups: () => void;
    rooms: Array<Room>;
    create:boolean;
    setcreate:Function
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [connected, setConnected] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const socketRef = useRef<Socket | null>(null);
  const [create, setcreate] = useState(false);
    const { pushPopup } = usePopup();

    useEffect(() => {
        try {
            const socket: Socket = io('http://localhost:9310');
            socketRef.current = socket;

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
            console.log(error);
        }
    }, []);

    useEffect(() => {
        if (connected) {
            socketRef.current?.on('message', (data) => {
                console.log(data)
                switch (data.type) {
                    case 'error':
                        pushPopup(data.error);
                        break;
                    case 'CREATEROOM':
                        pushPopup(data.message);
                        break;
                    case 'JOINROOM':
                        pushPopup(data.message);
                        break;
                    case 'GETROOMS':
                        setRooms(data.rooms);
                        break;
                    default:
                        console.log(data);
                }
            });

            return () => {
                socketRef.current?.off('message');
            };
        }
    }, [connected, pushPopup]);

    const JoinGroup = (id: number, name: string, code: number) => {
        if (socketRef.current) {
            socketRef.current.emit('JOINROOM', { id, name, code });
        }
    };

    const CreateGroup = (name:string, roomname:string, limit: number, type: string, numbers: boolean, symbols: boolean, duration: number, text: string) => {
        if (socketRef.current) {
            const code = LinearCongruentialGenerator(Date.now());
            const data = { name, roomname, limit, type, duration, text, numbers, symbols, code };
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
        <SocketContext.Provider value={{ socket: socketRef.current, connected, JoinGroup, LeaveGroup, CreateGroup, sendResult, getGroups, rooms, create , setcreate }}>
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
