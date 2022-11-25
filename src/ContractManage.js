import Web3 from 'web3';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config';
import { fileMetadata } from './FileManage';

export const isConnected = async () => {
  if (typeof window.ethereum === 'undefined') {
    return false;
  }
  if (!window.ethereum.isMetaMask) {
    return false;
  }
  const account = await window.ethereum.request({ method: 'eth_accounts' });
  console.log(account);
  if(account.length === 0)
    return false;
  return account[0];
}

export const connAccount = async (handler) => {

  if (typeof window.ethereum === 'undefined') {
    window.open('https://metamask.io/download.html');
    return false;
  }

  if (!window.ethereum.isMetaMask) {
    window.open('https://metamask.io/download.html');
    return false;
  }

  window.ethereum.on('accountsChanged', handler);
  if(await isConnected())
    return true;
  
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch(err) {
    console.log(err);
    return false;
  }
  
  return true;
  
}

export const setToken = async (hash, key, path) => {
  const account = await isConnected();
  if(!account)
    return;
  const lib = new Web3(window.ethereum);

  const contract = new lib.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS, {from:account});
  const mint_price = await contract.methods.mintPrice().call();
  try {
    await contract.methods.addAudio(hash, key, path).send({value:mint_price});
  } catch(err){
    console.log(err);
    return false;
  }
  return true;
}

export const getTokenList = async () => {
  const account = await isConnected();
  if(!account)
    return [];
  const lib = new Web3(window.ethereum);
  
  const contract = new lib.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS, {from:account});
  const tlist = await contract.methods.tokenList().call();
  let outlist = [];
  for(const item of tlist){
    const metadata = await fileMetadata(item.uri);
    outlist.push({
      tokenId:item.tokenId,
      hash:item.hash,
      name:metadata.name
    });
  };
  
  return outlist;
}

export const getTokenKeyURI = async (id) => {
  const account = await isConnected();
  if(!account)
    return undefined;
  const lib = new Web3(window.ethereum);
  
  const contract = new lib.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS, {from:account});
  try {
    const key = await contract.methods.tokenKEY(id).call();
    const uri = await contract.methods.tokenURI(id).call();
    return {
      key:key,
      uri:uri
    };
  } catch(err){
    console.log(err);
    return undefined;
  }
}