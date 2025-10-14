import React, { createContext } from 'react'
import { useLocalStorage } from  "@solana/wallet-adapter-react";

export interface AutoConnectContextStatem {
  autoConnect: boolean,
  setAutoConnect: (autoConnect:boolean) => void;
};

export const autoConnectContext = createContext<AutoConnectContextStatem>({} as AutoConnectContextStatem);

function autoConnectProvider() {

  

  return (
    <div>
        
    </div>
  )
}

export default autoConnectProvider