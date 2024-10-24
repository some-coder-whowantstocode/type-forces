'use client';
import { SocketContextType, useSocket } from '../context/SocketContext';
import styled from 'styled-components';
import Createroom from './component/Createroom';
import { usePopup } from '@vik_9827/popup/dist/bundle.js';
import { useEffect, useState } from 'react';
import { useRouter as navrouter } from 'next/navigation';

const CompetePage = styled.div`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  min-height: 100vh;
  width: 100vw;
  position: relative;
`;

const CompeteRoom = styled.div`
  display: flex;
  align-items: center;
  padding: 80px 0px;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  background-color: #000e1f;
  position: relative;
`

const Room = styled.div`
  display: flex;
  width: 70vw;
  justify-content: space-between;
  color: white;
  cursor: pointer;
  &:hover{
    background-color: #201c1c !important;
  }
  div{
    display: flex;
    padding: 0.4rem 0px;
    p{
      margin: 0px 0.4rem;
    }
  }
  button{
    margin: 0px 1rem;
    padding: 0.4rem 0.5rem;
    border: none;
    border-radius:0.4rem;
    cursor: pointer;
    background-color: #1b5ccb;
    color: white;
    &:hover{
    background-color: #0747b5;
    }
  }
`

const Controls = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #292222;
  display: flex;
  align-items: center;
  width: 100vw;
  padding: 1rem;
  justify-content: center;
  button{
    margin: 0px 1rem;
    padding: 0.4rem 0.5rem;
    border: none;
    border-radius:0.4rem;
    cursor: pointer;
    background-color: #1b5ccb;
    color: white;
    &:hover{
    background-color: #0747b5;
    }
  }
`

const JoinRoom = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  height: 100vh;
  width: 100vw;
  background-color: #0000009e;
  z-index: 100;

`

const Box = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: #00182c;
  color: white;
  padding: 1rem 2rem;
  input{
    width: 300px;
    font-size:1rem;
    height: 30px;
    border-radius: 1rem;
    outline: none;
    padding-left: 0.5rem;
  }
  div{
    display: flex;
    align-items:center;
    justify-content: center;

    button{
      padding: 0.4rem 0.7rem;
      margin: 1rem;
      font-size: 1rem;
      border: none;
      border-radius: 1rem;
      color: white;
      cursor: pointer !important;
    } 
  }
`

interface roomdata{
  roomname:string,
  id:number,
  type:string
}

const Page: React.FC = () => {
  const { rooms, getGroups, create, setcreate, JoinGroup, connected } = useSocket() as SocketContextType;
  const popup = usePopup();

  const [join, setjoin] = useState(false);
  const [roominfo, setri] = useState<roomdata|null>(null);
  const [name,setname] = useState("");
  const [code, setcode] = useState("");

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

  const verify =()=>{
    if(roominfo){
      if(name.length < 3 || name.length > 20 ){
        popup.pushPopup('Name mush be between 4-20 characters');
        return;
      }
      if(roominfo.type === "private" && code.length < 3){
        popup.pushPopup('Provide the code');
        return;
      }
      JoinGroup(roominfo.id,name,Number(code));
      setcode("");
      setjoin(false);
    }
  }

  return (
    <CompetePage>
      {
        create &&
        <Createroom />
      }

      {
        !create && 
        <CompeteRoom>

      {
        (join && roominfo) &&
        <JoinRoom>
          <Box>
            <div>
            <p>join {roominfo.roomname}</p>
            </div>
            <p>name</p>
            <input type="text" value={name} onChange={(e)=>setname(e.target.value)} />
            {
              roominfo.type === 'private' && <>
              <p>code</p>
            <input type="text"  value={code} onChange={(e)=>setcode(e.target.value)}  />
              </>
            }
            <div>
              <button
              style={{
                backgroundColor:'#830000'
              }}
              onClick={()=>{
                setjoin(false)
              }}
              >cancel</button>
              <button
              style={{
                backgroundColor:'#0092ac'
              }}
              onClick={()=>{
                verify();
              }}
              >join</button>
            </div>
          </Box>
        </JoinRoom>
      }
      <Room
      style={{
        backgroundColor:'#201c1c',
        cursor:'unset'
      }}
      >
        <div>
          <p>Room name</p>
        </div>
        <div>
          {
            connected ?
            <button onClick={getGroups} >update</button>
            :
      <button onClick={getGroups} disabled style={{cursor:"no-drop"}} >update</button>
          }
        </div>
      </Room>
      {rooms.map(({ roomname, id, type, limit,mems },i) => (
        <Room
        key={id}
        onClick={()=>{
          if(mems< limit){
            setri({id,type, roomname});
            setjoin(true);
          }else{
            popup.pushPopup("Room is already full")
          }
        }}
        style={{
          backgroundColor:`${i%2 ? '#3a3a3a' : '#685f5f'}`
        }}
        >
          <div>
          <p>{roomname}</p>
          </div>
          <div>
          <p>{type}</p>
          <p>{mems}/{limit}</p>
          </div>
        </Room>
      ))}
      <Controls>
      <button onClick={() => setcreate(true) }>create Room</button>
      {/* <button onClick={()=>setjoin(true)}>join Room</button> */}
      </Controls>
      </CompeteRoom>
      }
    </CompetePage>
  );
};

export default Page;
