"use client"
import React, { useEffect, useState } from 'react'
import { generatetext } from './generatetext';

const Page = () => {
    const [text, settext] = useState(""); 

    useEffect(()=>{
        const temptext = generatetext(true, false, false, false, 60);
        settext(temptext);
    },[]);
    return (
    <div>
        <p>{text}</p>
        <button 
        onClick={()=>{
            const temptext = generatetext(true, false, false, false, 60);
            settext(temptext);
        }}
        >generate</button>
    </div>
    )
}

export default Page
