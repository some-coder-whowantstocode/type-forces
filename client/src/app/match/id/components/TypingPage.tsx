import React, { useEffect, useState } from 'react'
import TypeWriter from '@vik_9827/type-writer/dist/bundle.js';
import { useCompete } from '@/app/context/CompeteContext';
import styled from 'styled-components';

const Tpage = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #302b2b;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Time = styled.div`
  position: fixed;
  top: 50px;
  right: 10px;
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  letter-spacing: 3px;
  z-index: 99999999999;
`

interface typedata {
  wpm: number,
  raw_wpm: number,
  accuracy: number
}

const TypingPage = () => {
  const { text, duration, setstate, competestates, sendResult, setloading } = useCompete();
  const data = (data: typedata) => {
    setstate(competestates[0]);
    setloading(false)
    sendResult(data.wpm, data.raw_wpm, data.accuracy)
  }
  const [time, settime]= useState<number>(duration);

  useEffect(()=>{
    const timeid = setTimeout(() => {
      settime(prev=>prev-1);
    }, 1000);

    return()=>{
      clearTimeout(timeid);
    }
  },[])

  return (
    <Tpage>
      {/* <Time>{time}</Time> */}
      <TypeWriter
        custommode={true}
        custominput={text}
        customStyle={{}}
        setdata={data}
        repetation={duration || 20}
        // auto={true}
      />
    </Tpage>
  )
}

export default TypingPage
