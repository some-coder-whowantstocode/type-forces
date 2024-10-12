import styled from "styled-components";
import { IoSettings } from "react-icons/io5";

const Navbar =styled.div`
display: flex;
align-items: center;
justify-content: space-between;
position: absolute;
top: 0;
left: 0;
width: 100vw;
padding: 1rem;
background-color: #202123;
color: white;
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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

const Settings = styled(IoSettings)`
    cursor: pointer;
`

export {
    Navbar,
    Logo,
    Locations,
    Settings,
    LocationBackground
}