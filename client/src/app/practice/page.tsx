"use client"
import React from 'react'
import TypeWriter from '@vik_9827/type-writer/dist/bundle.js';

const page = () => {
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
