import { useCompete } from '@/app/context/CompeteContext'
import { useSocket } from '@/app/context/SocketContext'
import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface leaderboardprops{
    num:number
}

interface btn{
    clickable:boolean
}

const Page = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-color: #011934;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    overflow-y: hidden;
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;


const Loading = styled(AiOutlineLoading3Quarters)`
    animation: ${rotate} 2s linear infinite;
    padding: 2re
`

const Start = styled.div<btn>`
    background-color: #2b2727;
    height: 100vh;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    button{
        font-size: 1.3rem;
        padding: 1rem 2rem;
        border: none;
        border-radius: 1rem;
        box-shadow: 7px 7px 6px -5px black;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: 500;
        border: 0.5px solid #9a999913;
        display: flex;
        align-items: center;
        justify-content: center;
        ${
            props=>!props.clickable  && `
                &:hover{
                color: #3f3939;
                box-shadow: 9px 9px 10px -2px black;
                }
                &:active{
                background-color: #e3e2e2;
                box-shadow: 9px 9px 10px -7px black inset;
                }
            `
        }
      
    }
`

const LeaderBoard = styled.div`
    width: min(400px, calc(100vw/3));
    color: white;
    height: 100vh;
    padding-top: 80px;
    overflow-y: scroll;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none; 
    h3{
        position: fixed;
        top: 60px;
        left: 0;
        width: min(400px, calc(100vw/3));
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 0.5rem;
        background-color: #011934;
        
    }
    overflow: -moz-scrollbars-none;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar{
        display: none;
    }
`

const LeaderBoardName = styled.div<leaderboardprops>`
    background-color: #fdfdfd;
    color: black;
    margin: 1rem 0.5rem;
    padding: 0.5rem 0.3rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    span{
        padding-left: 0.3rem;
        width: 20%;
        overflow: hidden;
    }
    div{
        width: 60%;
        overflow: hidden;
    }
    p{
        width: 20%;
        margin-left: 10px;
        overflow: hidden;
    }
    /* justify-content: center; */

`

const Chat = styled.div`
    width: min(400px, calc(100vw/3));
    color: white;
    height: 100vh;
    padding: 90px 0px 50px 0px;
    overflow-y: scroll;
    position: relative;
    overflow: -moz-scrollbars-none;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar{
        display: none;
    }
    h3{
        position: fixed;
        top: 60px;
        right: 0;
        width: min(400px, calc(100vw/3));
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 0.5rem;
        background-color: #011934;
        -webkit-user-select: none;
        -moz-user-select: none; 
        -ms-user-select: none; 
        user-select: none; 
    }
    input{
        position: fixed;
        right: 0;
        bottom: 0;
        width: min(400px, calc(100vw/3));
        font-size: 1rem;
        height: 50px ;
        border: none;
        outline: none;
        border: 2px solid #011934;
        border-radius: 0.5rem;
        padding-left: 5px;
    }
    button{
        position: fixed;
        right: 0;
        bottom: 2px;
        font-size: 1rem;
        border: none;
        outline: none;
        border-radius: 0.5rem;
        padding: 14px;
        background-color: #0064a7;
        color: white;
    }
`

const Message = styled.div`
    background-color: white;
    color: black;
    height: fit-content;
    margin: 1rem 0.5rem;
    border-radius: 0.5rem;
    padding: 0.3rem 0.4rem;
    span{
        color: #077173;
        font-weight: 700;
    }
`


const WaitingPage = () => {
    const {members, connected} = useSocket();
    const {chat, sendMessage, loading, startMatch} = useCompete()
    const [msg, setmessage] = useState("");
    return (
        <Page>
            <LeaderBoard>
                <h3>LeaderBoard</h3>
                <div>
                {
                        members.map(({name, points},i)=>(
                            <LeaderBoardName 
                            num={i}
                            key={i}
                            >
                                <span>{i+1}</span>
                                <div>{name}</div>
                                <p>{points}</p>
                            </LeaderBoardName>
                        ))
                    }
                </div>
                </LeaderBoard>
                    <Start
                    clickable={loading}
                    >
                        {

                            loading ?
                            <button><Loading/></button>
                            :
                            connected ?
                            <button
                            onClick={()=>startMatch()}
                            >start</button>
                            :
                            <button
                            onClick={()=>startMatch()}
                            disabled
                            style={{cursor:"no-drop"}}
                            >start</button>
                        }
                    </Start>            
                <Chat>
                    <h3>chat</h3>
                    <div>
                        {
                            chat.map(({name, message},i)=>(
                                <Message
                                key={`${i}th message by ${name}`}
                                >
                                    <span>{name.slice(0,8)}</span>
                                    <p>{message}</p>
                                </Message>
                            ))
                        }
                    </div>
                    <input type="text" value={msg} onChange={(e)=>{
                        setmessage(e.target.value)}
                        } placeholder='write message here...' />
                        {
                            connected ?
                            <button onClick={()=> {
                            (msg.trim()).length > 0 &&  sendMessage(msg)
                            setmessage("")
                            }}>send</button>
                            :
                            <button onClick={()=> {
                            (msg.trim()).length > 0 &&  sendMessage(msg)
                            setmessage("")
                            }}
                            disabled
                            style={{
                                cursor:'no-drop'
                            }}
                            >send</button>
                        }
                    
                </Chat>
        </Page>
    )
}

export default WaitingPage
