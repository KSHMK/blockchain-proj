import { useWeb3React } from '@web3-react/core';
import { injected } from './lib/connectors';
import { useEffect, useState } from 'react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config';

const Account = () => {

  const {
    connector,
    library,
    chainId,
    account,
    active,
    error,
    activate,
    deactivate
  } = useWeb3React();

  const handdleConnect = () => {
    if(active) {
      deactivate();
      return;
    }
    
    activate(injected, (error) => {
      if('/No Ethereum provider was found on window.ethereum/'.test(error)) {
        window.open('https://metamask.io/download.html');
      }
    });
  }
  
  return (
    <div>
      <div>
        <p>Account: {account}</p>
        <p>chainId: {chainId}</p>
      </div>
      <div>
        <button type="button" onClick={handdleConnect}>{active ? 'disconnect':'connect'}</button>
      </div>
    </div>
  )
}

export default Account;
