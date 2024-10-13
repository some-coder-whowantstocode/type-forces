import React, {ReactNode, useEffect, useState, useRef} from 'react'
import {Navbar, Logo, Locations, Settings, LocationBackground} from './navbarstyle.jsx'
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { pagesliceval, updatePage } from '../../lib/features/pageSlice';
import { RootState } from '../../lib/store.js';

interface LayoutProps {
    children: ReactNode;
}


const layout : React.FC<LayoutProps> = ({children}) => {
    const {currentPage, prevPage, locations} : pagesliceval = useSelector((state : RootState)=>state.page);
    const router = useRouter();
    const path = usePathname();

    const locationref = useRef(null);
    const locationbgref = useRef(null);
    const currentpageref = useRef("");

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(updatePage(path));
    },[])


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
                            if(path === location) return;
                                router.replace(location);
                                dispatch(updatePage(location));
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
