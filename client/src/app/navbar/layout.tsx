import React, {ReactNode, useEffect, useState, useRef} from 'react'
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from "styled-components";
import { IoReload } from "react-icons/io5";
import { TbBrandSocketIo } from "react-icons/tb";
import { pagesliceval, updatePage } from '../../lib/features/pageSlice';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RootState } from '../../lib/store.js';
import { useSocket } from '../context/SocketContext';

const Navbar =styled.div`
display: flex;
align-items: center;
justify-content: space-between;
position: fixed;
top: 0;
left: 0;
width: 100vw;
padding: 1rem;
background-color: #202123;
color: white;
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
z-index: 1000;
`

const Logo = styled.div`
    font-size: 1.3rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 1px;
`

const Locations = styled.div`
display: flex;
p{
    position: relative;
    z-index: 1000;
    font-size: 1.1rem;
    margin: 0px 1rem;
    cursor: pointer;
    &:hover{
        color: #969696;
    }
}
`

const LocationBackground = styled.div`
    position: absolute;
    background-color: #1356a8;
    border-radius: 1rem;
  position: absolute;
  transition: left 0.5s ease, top 0.5s ease, height 0.5s ease, width 0.5s ease;
`

const Reconnect = styled(IoReload)`
    cursor: pointer;
    color: red;
    font-weight: 900;
    font-size: 1.4rem;
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
    cursor: pointer;
    color: white;
    font-weight: 900;
    font-size: 1.4rem;
    animation: ${rotate} 2s linear infinite;
`

const Connected = styled(TbBrandSocketIo)`
    cursor: pointer;
    color: green;
    font-weight: 900;
    font-size: 1.4rem;
`


interface LayoutProps {
    children: ReactNode;
}


const layout : React.FC<LayoutProps> = ({children}) => {
    const {currentPage, prevPage, locations} : pagesliceval = useSelector((state : RootState)=>state.page);
    const router = useRouter();
    const path  = usePathname();
    const regex = /\/(.*?)(\/|$)/;
    const locationref = useRef(null);
    const locationbgref = useRef(null);
    const currentpageref = useRef("");
    const {connected, connecting, wakeup} = useSocket();

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(updatePage(path));
    },[])

    useEffect(()=>{
        console.log(connected)
    },[connected])


    useEffect(()=>{
        try {
            const providelocation =()=>{
                if(!locationbgref.current || !locationref.current || path !== locations[currentPage]?.location) return;
                const padding =  5;

                currentpageref.current = path;                
                const prevlocation = ((locationref.current as HTMLElement).children[prevPage] as HTMLElement).getBoundingClientRect();
                const prevlocationbg = (locationbgref.current as HTMLElement).style;
                prevlocationbg.left = `${prevlocation.x - padding }px`;
                prevlocationbg.top = `${prevlocation.y - (padding - 6 )}px`;
                prevlocationbg.height = `${prevlocation.height + ((padding *2 ) - 6) }px`;
                prevlocationbg.width = `${prevlocation.width + (padding * 2) }px`;
                
                const location = ((locationref.current as HTMLElement).children[currentPage] as HTMLElement).getBoundingClientRect();
                const locationbg = (locationbgref.current as HTMLElement).style;
                    locationbg.left = `${location.x - padding}px`;
                    locationbg.top = `${location.y - (padding - 3)}px`;
                    locationbg.height = `${location.height + (padding * 2)}px`;
                    locationbg.width = `${location.width + (padding * 2)}px`;
            }
            providelocation();

            window.addEventListener('resize',providelocation);

            return ()=>{
                window.removeEventListener('resize',providelocation);
            }
            
        } catch (error) {
            console.log(error)
        }
    },[currentPage, prevPage])

  return (
    <section>
        <Navbar>
            <Logo>TYPEFORCES</Logo>
            <Locations 
            ref={locationref}
            >
                {
                    locations.map(({name, location},i)=>(
                        <p
                        key={i+"th location key"}
                        onClick={()=>{
                            if(!path) return;
                            const match = path.match(regex);
                            if(!match || match[1] === location) return;
                                router.replace(location);
                                dispatch(updatePage(location));
                        }}
                        >{name}</p>
                    ))
                }
            </Locations>
            <LocationBackground ref={locationbgref} ></LocationBackground>
            {
                connected ?
                <Connected   title='connected'/>
                :
                connecting ?
                <Loading  title='connecting'/>
                :
                <Reconnect onClick={()=>wakeup()}  title='reconnect'/>
            }
        </Navbar>
        {children}
    </section>
  )
}

export default layout
