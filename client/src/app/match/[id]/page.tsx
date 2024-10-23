'use client'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import WaitingPage from './components/WaitingPage';
import TypingPage from './components/TypingPage';
import PostcompetePage from './components/PostcompetePage';
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

interface mems{
    name:string,
    id:string
}

const page: React.FC<{mems:Array<mems>}> = (mems) => {
    const {roomname, LeaveGroup, setroomid} = useSocket();
    const {reset, competestate, competestates} = useCompete();
    const router = useRouter();

    useEffect(()=>{
        console.log(competestate)
    },[competestate])

    return (
        <CompetePage>
            {  <header>
                <button
                onClick={()=>{
                    
                    LeaveGroup();
                    reset();
                    setroomid(null);
                    router.replace('/compete')
                }}
                >Leave</button>
                <p>{(roomname && roomname.length > 0) ? roomname : "roomname" }</p>
            </header>}
            {
                competestate === competestates[0] ?
                <WaitingPage/>
                :
                competestate === competestates[1] ?
                <PostcompetePage/>
                :
                <TypingPage/>
            }
                {/* <TypingPage/> */}

        </CompetePage>
    )
}

export default page
