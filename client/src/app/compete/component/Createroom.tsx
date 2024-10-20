import React, { useState } from 'react'
import styled from 'styled-components'
import Range from './Range'
import { usePopup } from '@vik_9827/popup';
import { useSocket } from '@/app/context/SocketContext';


const CreateRoom = styled.div`

  width: 100vw;
  min-height: 100vh;
  padding: 80px 100px;
  color: #00a6bf;
  background-color: #000e1f;
  div{
    margin-bottom: 1rem;
  }
  p{
    font-size: 1rem;
    padding: 0.4rem 0.3rem;
    font-weight: 300;
  }
`
const Cancelcreate = styled.div`
  display: flex;
  flex-direction: row-reverse;
  button{
    color: white;
    background-color: #0482e9;
    padding: 0.4rem 0.6rem;
    border: none;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    margin-right: 1rem;
    &:hover{
    background-color: #005ba5;
    }
  }
`


const NameSpace = styled.div`
box-shadow: rgba(4, 149, 189, 0.35) 0px 5px 15px;
padding: 1rem;
border-radius: 1rem;
  input{
    border: none;
    width: 100%;
    height: 30px;
    font-size: 1rem;
    border-radius: 0.5rem;
    padding-left: 0.3rem;
    outline: none;
    background-color: #18293e;
    color: white;
  }
`

const Privateroom = styled.div`

  display: flex;
  border: 1px solid #76767692;
  width: max-content;
  border-radius: 1.5rem;
  /* padding: 0.2rem 0.5rem; */
  transition: all 0.3s;
  p{
    color: white;
  border-radius: 1.5rem;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  }
`

const Providetext = styled.div`
  box-shadow: rgba(4, 149, 189, 0.35) 0px 5px 15px;
padding: 1rem;
border-radius: 1rem;
textarea{
  background-color: #18293e;
  outline: none;
  border: none;
  border-radius: 1rem;
  resize: none;
  width: 100%;
  height: 100px;
  font-size: 1rem;
  color: white;
  padding: 1rem;
}
`


const UserLimit = styled.div`
box-shadow: rgba(4, 149, 189, 0.35) 0px 5px 15px;
padding: 1rem;
border-radius: 1rem;
  input{
    color: white;
  }
`

const Options = styled.div`
  display: flex;
  flex-direction: column;
  div{
    display: flex;
    p{
    border-radius: 1.7rem;
    border: 2px solid ;
    color: #00a6bf;
    width: fit-content;
    padding: 0.4rem 1rem;
    cursor: pointer;
    margin-right: 1rem;
    user-select: none;
  }
  }
 
`


const Createroom: React.FC = () => {
    const popup = usePopup();
    const { CreateGroup, setcreate } = useSocket();
    const [roomname, setroomname] = useState("");
    const [roomlimit, setlimit] = useState(2);
    const [type, settype] = useState('public');
    const [symbols, setsymbols] = useState(false);
    const [numbers, setnumbers] = useState(false);
    const [duration, setduration] = useState(20);
    const [text, settext] = useState("");
    const [givetext, settxt] = useState(false);
    const [name, setname] = useState("");

    const reset = () => {
        setroomname("");
        setlimit(2);
        settype("public");
        setsymbols(false);
        setnumbers(false);
        setduration(20);
        settext("");
        settxt(false);
        setcreate(false);
    }

    const verify = () => {
        try {
            if (name.length < 3 || name.length > 21) {
                popup.pushPopup("name must be between 4 - 20 letters");
                return;
            }
            if (roomname.length < 3 || roomname.length > 21) {
                popup.pushPopup("Room name must be between 4 - 20 letters");
                return;
            }
            if (givetext && text.length < 20) {
                popup.pushPopup("Custom text can not be smaller than 20");
                return;
            }
            CreateGroup(name,roomname, roomlimit, type, numbers, symbols, duration, text);
            reset();
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <CreateRoom>
            <Cancelcreate>
                <button onClick={() => verify()}>create</button>
                <button
                    style={{
                        backgroundColor: '#8a0000'
                    }}
                    onClick={() => reset()}
                >cancel</button>
            </Cancelcreate>
            <NameSpace>
                <p>Name</p>
                <input type="text" value={name} max={20} min={4} onChange={(e) => setname(e.target.value)} placeholder='your name' required />
            </NameSpace>

            <NameSpace>
                <p>Room Name</p>
                <input type="text" value={roomname} max={20} min={4} onChange={(e) => setroomname(e.target.value)} placeholder='Room name' required />
            </NameSpace>

            <UserLimit>
                <p>No of participants</p>
                <p>{roomlimit}</p>
                <Range min={2} max={100} setval={setlimit} />
            </UserLimit>
            <UserLimit>
                <p>Duration of each typing session</p>
                <p>{duration}</p>
                <Range min={20} max={120} setval={setduration} />
            </UserLimit>
            <div>
                <p>Select the type of room</p>
                <Privateroom>
                    <p
                        onClick={() => settype('private')}
                        style={{
                            color: `${type === 'private' ? '#00a6bf' : 'white'}`,
                            border: `${type === 'private' ? ` 2px solid #00a6bf` : 'none'}`
                        }}
                    >Private</p>
                    <p
                        onClick={() => settype('public')}
                        style={{
                            color: `${type === 'public' ? '#00a6bf' : 'white'}`,
                            border: `${type === 'public' ? ` 2px solid #00a6bf` : 'none'}`
                        }}
                    >Public</p>
                </Privateroom>
            </div>
            <div></div>
            <div>
                <div>
                    <p>provide text</p>
                    <Privateroom>
                        <p
                            onClick={() => settxt(true)}
                            style={{
                                color: `${givetext ? '#00a6bf' : 'white'}`,
                                border: `${givetext ? ` 2px solid #00a6bf` : 'none'}`
                            }}
                        >Custom</p>
                        <p
                            onClick={() => settxt(false)}
                            style={{
                                color: `${!givetext ? '#00a6bf' : 'white'}`,
                                border: `${!givetext ? ` 2px solid #00a6bf` : 'none'}`
                            }}
                        >Normal</p>
                    </Privateroom>
                </div>
                <Providetext>
                    {
                        givetext ?

                            <div>
                                <textarea name="" id="" value={text} onChange={(e) => {
                                    settext(e.target.value);
                                }} ></textarea>
                            </div>

                            :
                            <Options>
                                <div>
                                    <p
                                        style={{
                                            color: `${numbers ? 'white' : "#00a6bf"}`,
                                            backgroundColor: `${numbers ? '#00a6bf' : "transparent"}`
                                        }}
                                        onClick={() => setnumbers(prev => !prev)}
                                    >Numbers</p>
                                    <p
                                        style={{
                                            color: `${symbols ? 'white' : "#00a6bf"}`,
                                            backgroundColor: `${symbols ? '#00a6bf' : "transparent"}`
                                        }}
                                        onClick={() => setsymbols(prev => !prev)}
                                    >Symbols</p>
                                </div>
                                <div>
                                    sample text: adfafsd{numbers && '2133'} {symbols && '$#@%'}
                                </div>
                            </Options>
                    }
                </Providetext>
            </div>
        </CreateRoom>
    )
}

export default Createroom
