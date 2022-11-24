import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config';
import CryptoJS from 'crypto-js';
import { create } from 'ipfs-http-client';

const ContractDownload = () => {
  const [log, setLog] = useState('');
  const [id, setID] = useState('');

  async function download(){
    if(!active)
      return;
    let uri;
    const contract = new library.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    setLog("start contract");
    try{
      uri = await contract.methods.tokenURI(id).call({from:account});
    } catch(err){
      console.log(err);
      setLog("contract failed");
    }
    fetch(uri).then(() => {
      setLog("Success")
    }).catch((err) => {
      console.log(err)
      setLog("Error")
    })
  }
    // const anchorElement = document.createElement('a');
    // document.body.appendChild(anchorElement);
    // anchorElement.download = encryptedFile.name;
    // anchorElement.href = URL.createObjectURL(encryptedFile);
    // anchorElement.click(); 
    // document.body.removeChild(anchorElement); // cleanup - 쓰임을 다한 a 태그 삭제
  const {
    library,
    account,
    active,
  } = useWeb3React();

  return (
    <div>
      <hr />
      <p>Download</p>
      <input value={id} onChange={e => setID(e.target.value)} type="number" />
      <button type="button" onClick={download}>get</button>
      <p>{log}</p>
    </div>
  )
}
export default ContractDownload;