"use client"
import React,{useEffect} from 'react'
import TypeWriter from '@vik_9827/type-writer/dist/bundle.js';
import { useRouter as navrouter } from 'next/navigation';
import { useSocket } from '../context/SocketContext';
import { useRouter } from 'next/router';

const page = () => {

  const navigation = navrouter();
  const {inroom} = useSocket();
  const gotomatch =()=>{
    if(inroom){
      navigation.replace('/match/id')
    }
  }


  useEffect(() => {

    
    const checkIfPC = () => {
      const userAgent = navigator.userAgent;
      const mobileDevices = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return !mobileDevices.test(userAgent)
    };

    if (!checkIfPC()) {
      navigation.replace('/');
    }
    gotomatch();
  }, []);

  useEffect(()=>{
    gotomatch()
  },[inroom])

  return (
    <>
    <TypeWriter 
    customStyle={{
      bg:'#292a2b'
    }}
    />
    </>
  )
}

export default page
