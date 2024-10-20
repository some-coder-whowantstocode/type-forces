import { createContext, ReactNode, useContext } from "react";

interface CompeteData{

}

const Competecontext = createContext<CompeteData|null>(null);

export const CompeteProvider : React.FC<{children:ReactNode}> =({children})=>{
    return(
        <Competecontext.Provider
        value={{

        }}
        >
        {children}
        </Competecontext.Provider>
    )
}

export const useCompete = ()=>useContext(Competecontext);