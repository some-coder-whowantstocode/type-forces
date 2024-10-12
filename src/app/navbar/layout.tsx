import React, {ReactNode, useEffect, useState, useRef} from 'react'
import {Navbar, Logo, Locations, Settings, LocationBackground} from './navbarstyle.jsx'
import { useRouter, usePathname } from 'next/navigation';

interface LayoutProps {
    children: ReactNode;
}


const layout : React.FC<LayoutProps> = ({children}) => {
    const router = useRouter();
    const path = usePathname();

    const locationref = useRef(null);
    const locationbgref = useRef(null);
    const currentpageref = useRef("");

    const locations = [
        {name:'compete', location:'/compete'},
        {name:'practice', location:'/practice'},
    ]

    useEffect(()=>{
        try {
            const providelocation =()=>{
                if(!locationbgref.current || !locationref.current) return;
                let index = 0, previndex = 1;
                const padding =  5;
                
                if(path){
                    locations.map(({location},i)=>{
                        if(path === location) index = i;
                        if(currentpageref.current === location) previndex = i;
                    })
                }
                console.log(path, currentpageref.current)
                currentpageref.current = path;                
                const prevlocation = ((locationref.current as HTMLElement).children[previndex] as HTMLElement).getBoundingClientRect();
                const prevlocationbg = (locationbgref.current as HTMLElement).style;
                prevlocationbg.left = `${prevlocation.x - padding }px`;
                prevlocationbg.top = `${prevlocation.y - (padding -3)}px`;
                prevlocationbg.height = `${prevlocation.height + (padding *2) }px`;
                prevlocationbg.width = `${prevlocation.width + (padding * 2) }px`;
                
                const location = ((locationref.current as HTMLElement).children[index] as HTMLElement).getBoundingClientRect();
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
    },[path])

  return (
    <section>
        <Navbar>
            <Logo>TYPEFORCES</Logo>
            <Locations 
            ref={locationref}
            >
                {
                    locations.map(({name, location})=>(
                        <p
                        onClick={()=>{
                            if(path !== location){
                                router.replace(location);
                            }
                        }}
                        >{name}</p>
                    ))
                }
            </Locations>
            <LocationBackground ref={locationbgref} ></LocationBackground>
            <Settings/>
        </Navbar>
        {children}
    </section>
  )
}

export default layout
