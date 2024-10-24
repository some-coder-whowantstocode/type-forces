import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

const RangeBox = styled.div`
div{
  width: 200px;
  height: 3px;
  background-color: #a49d9d;
  position: relative;
  border-radius: 1rem;
  div{
    height: 15px ;
    width: 15px;
    border-radius: 50%;
    background-color: #00ffff;
    /* color: ; */
    position: absolute;
    top: 50%;
    border: 1px solid #00ffff;
    transform: translateY(-50%);
  }
}
`

const Range : React.FC<{min:number, max:number, setval:Function}> = ({min , max, setval}) => {
    const initpos = useRef({x:0});
    const movex = useRef(0);
    const drag = useRef(false);
    const ballref = useRef<HTMLDivElement | null>(null);
    const barref = useRef<HTMLDivElement | null>(null);
    useEffect(()=>{
        const handleup =()=>{
            drag.current = false;
        }

        const handlemove=(e:MouseEvent )=>{
            try {
                e.preventDefault();
                if(!drag.current) return;
                const bar = barref.current;
                const ball =  ballref.current;
                let x=0,width=0;
                if(bar){
                    const size = bar.getBoundingClientRect();
                    x = size.x;
                    width = size.width;
                }
                let pos = {x : e.clientX - initpos.current.x}
                const temppos = movex.current + pos.x ;
                
                initpos.current.x = e.clientX;
                const end = width-10 ;
                const percentage = Math.round((temppos / end) * 100);
                const val = Math.round((percentage/100) * max);
                console.log(percentage)
                if(percentage < 0 || percentage > 100 ){
                    return;
                }

                if(ball){  
                    if(val<min){
                        setval(min)
                    }else{
                        setval(val)
                    }
                    movex.current =temppos;
                    ball.style.left = temppos + 'px';
                }
            } catch (error) {
                console.log(error);
            }
        }
        window.addEventListener('mouseup',handleup)
        window.addEventListener('mousemove',handlemove)

        return(()=>{
            window.removeEventListener('mouseup',handleup);
            window.removeEventListener('mousemove',handlemove);
        })
    },[])

    return (
    <RangeBox>
        <div
        ref={barref}
        >
            <div
            ref={ballref}
            draggable
            onMouseDown={(e )=>{
                drag.current= true;
                e.preventDefault();
                initpos.current.x = e.clientX;
            }}
            ></div>
        </div>
    </RangeBox>
    )
}

export default Range
