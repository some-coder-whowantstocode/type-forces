'use client'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import WaitingPage from './components/WaitingPage';
import TypingPage from './components/TypingPage';
import { useSocket } from '@/app/context/SocketContext';
import { useRouter } from 'next/navigation';
import { useCompete } from '@/app/context/CompeteContext';

const CompetePage = styled.div`
    min-height: 100vh;
    width: 100vw;
    background-color: #48484a;

    header{
        height: 50px;
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        background-color: #001220;
        display: flex;
        align-items: center;
        color: white;
        font-size: 2rem;
        justify-content: center;
        z-index: 10;
        button{
        height: 30px;
        position: fixed;
        left: 10px;
        top: 10px;
        padding: 0.6rem 0.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: #740013;
        color: white;
        border-radius: 0.5rem;
        cursor: pointer;
        z-index: 100;
        }
        div{
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 1rem;
        height: 30px;
        position: fixed;
        right: 10px;
        top: 10px;
        padding: 0.6rem 0.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: #0265ac;
        color: white;
        border-radius: 0.5rem;
        cursor: pointer;
        z-index: 100;
        }
    }
`

const page: React.FC<{}> = () => {
    const { roomname, LeaveGroup, setroomid, connected } = useSocket();
    const { reset, competestate, competestates } = useCompete();


    const router = useRouter();

    useEffect(() => {
        const checkIfPC = () => {
            const userAgent = navigator.userAgent
            const mobileDevices = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
            return !mobileDevices.test(userAgent)
        };

        if (!checkIfPC()) {
            router.replace('/');
        }
    }, []);

    return (
        <CompetePage>
            {<header>
                {
                    connected ?
                        <button
                            onClick={() => {

                                LeaveGroup();
                                reset();
                                setroomid(null);
                                router.replace('/compete')
                            }}
                        >Leave</button>
                        :
                        <button
                            disabled
                            style={{
                                cursor: "no-drop"
                            }}
                        >Leave</button>
                }

                <p>{(roomname && roomname.length > 0) ? roomname : "roomname"}</p>
            </header>}
            {
                competestate === competestates[0] ?
                    <WaitingPage />
                    :
                    <TypingPage />
            }

        </CompetePage>
    )
}

export default page
