import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config';

const ContractviewList = () => {
  
  const [list, setList] = useState([])
  let flag=false;
  const {
    library,
    account,
    active,
  } = useWeb3React();

  async function viewList() {
    if(flag)
      return;
    flag = true;
    const tlist = [];
    const contract = new library.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const count = await contract.methods.balanceOf(account).call({from:account});
    console.log(count);
    for(let i=0;i<count;i++)
    {
      const tokenId = await contract.methods.tokenOfOwnerByIndex(account, i).call({from:account});
      console.log(tlist);
      tlist.push(tokenId);
    }
    setList(tlist);
  }
  useEffect(() => {
    viewList();
  }, [account]);

  return (
    <div>
      <hr />
      <p>Your Token List</p>
      {
        list.length !== 0 ? 
          list.map((value, idx) => {
            return <p key={idx}>{value}</p>
          })
        : <div></div>
      }
    </div>
  )
}

const ContractAddAudio = () => {

  const [log, setLog] = useState('');
  const [hash, setHash] = useState('');
  const [URI, setURI] = useState('');

  const {
    library,
    account,
    active,
  } = useWeb3React();

  async function set_contract(){
    if(!active)
      return;
    
    const contract = new library.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    setLog("start contract");
    try{
      const out = await contract.methods.addAudio(hash,URI).send({from:account});
      console.log(out)
      console.log(out.receipt)
      setLog("contract success");
    } catch(err){
      console.log(err);
      setLog("contract failed");
    }
  }

  return (
    <div>
      <hr />
      <p>addAudio</p>
      <input value={hash} onChange={e => setHash(e.target.value)} type="number" />
      <input value={URI} onChange={e => setURI(e.target.value)} />
      <button type="button" onClick={set_contract}>Send</button>
      <p>{log}</p>
    </div>
  )
}

const ContractviewHash = () => {
  const [log, setLog] = useState('');
  const [id, setID] = useState('');

  async function get_hash(){
    if(!active)
      return;
    
    const contract = new library.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    setLog("start contract");
    try{
      const out = await contract.methods.tokenHash(id).call({from:account});
      setLog(out);
    } catch(err){
      console.log(err);
      setLog("contract failed");
    }
  }

  const {
    library,
    account,
    active,
  } = useWeb3React();

  return (
    <div>
      <hr />
      <p>viewHash</p>
      <input value={id} onChange={e => setID(e.target.value)} type="number" />
      <button type="button" onClick={get_hash}>get</button>
      <p>{log}</p>
    </div>
  )
}

const ContractviewURI = () => {
  const [log, setLog] = useState('');
  const [id, setID] = useState('');

  const {
    library,
    account,
    active,
  } = useWeb3React();

  async function get_uri(){
    if(!active)
      return;
    
    const contract = new library.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    setLog("start contract");
    try{
      const out = await contract.methods.tokenURI(id).call({from:account});
      setLog(out)
    } catch(err){
      console.log(err);
      setLog("contract failed");
    }
  }

  return (
    <div>
      <hr />
      <p>viewURI</p>
      <input value={id} onChange={e => setID(e.target.value)} type="number" />
      <button type="button" onClick={get_uri}>get</button>
      <p>{log}</p>
    </div>
  )
}

const Contract = () => {
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
  return active ? (
    <div>
      <ContractviewList />
      <ContractAddAudio />
      <ContractviewHash />
      <ContractviewURI />
    </div>
  ) : <div></div>;
}

export default Contract;