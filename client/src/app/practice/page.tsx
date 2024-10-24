"use client"
import React,{useEffect} from 'react'
import TypeWriter from '@vik_9827/type-writer/dist/bundle.js';
import { useRouter as navrouter } from 'next/navigation';

const page = () => {

  const navigation = navrouter();

  useEffect(() => {
    const checkIfPC = () => {
      const userAgent = navigator.userAgent;
      const mobileDevices = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return !mobileDevices.test(userAgent)
    };

    if (!checkIfPC()) {
      navigation.replace('/');
    }
  }, []);

  const data =(data : object)=>{
    console.log(data);
  }
  return (
    <>
    <TypeWriter 
    customStyle={{
      bg:'#292a2b'
    }}
    setdata={data}
    />
    </>
  )
}

export default page
