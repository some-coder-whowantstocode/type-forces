import React, { useEffect } from 'react'
import TypeWriter from '@vik_9827/type-writer/dist/bundle.js';
import { useCompete } from '@/app/context/CompeteContext';
import styled from 'styled-components';

const Tpage =  styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #302b2b;
  display: flex;
  align-items: center;
  justify-content: center;
`

interface typedata{
  wpm:number,
  raw_wpm:number,
  accuracy:number
}

const TypingPage = () => {
  const {text, duration, setstate, competestates, sendResult, setloading} = useCompete();
  const data =(data:typedata)=>{
    setstate(competestates[0]);
    setloading(false)
    sendResult(data.wpm, data.raw_wpm, data.accuracy)
  }
  return (
    <Tpage>
      <TypeWriter 
      custommode={true}
      custominput={text}
      customStyle={{}}
      setdata={data}
      repetition={duration || 20}
      auto={true}
      />
    </Tpage>
  )
}

export default TypingPage
