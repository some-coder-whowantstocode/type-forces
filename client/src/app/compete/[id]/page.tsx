'use client'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import WaitingPage from './components/WaitingPage';
import TypingPage from './components/TypingPage';
import PostcompetePage from './components/PostcompetePage';

const CompetePage = styled.div`
    min-height: 100vh;
    width: 100vw;
    background-color: #48484a;
`

interface mems{
    name:string,
    id:string
}

const page: React.FC<{mems:Array<mems>}> = (mems) => {
    const [memslist,setmems] = useState([]);

    // first - right side all members rest start / waiting for other players , leave room , chat 
    // second (all ready) - typing page 
    // third (end) - 
    //memberslist typing page 
    return (
        <CompetePage>
            <WaitingPage/>
            <TypingPage/>
            <PostcompetePage/>
        </CompetePage>
    )
}

export default page
