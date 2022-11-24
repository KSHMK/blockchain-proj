import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import ContractUpload from './ContractUpload';
import ContractDownload from './ContractDownload';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config';
import CryptoJS from 'crypto-js';


const ContractviewList = () => {
  
  const [list, setList] = useState([])
  let flag=false;
  const {
    library,
    account,
  } = useWeb3React();

  async function viewList() {
    if(flag)
      return;
    flag = true;
    const contract = new library.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS, {from:account});
    const tlist = await contract.methods.tokenList().call();
    console.log(tlist);
    setList(tlist);
  }
  useEffect(() => {
    viewList();
  }, [account]);

  return (
    <div>
      <hr />
      <p>Your Token List</p>
      <table id="data">
        <thead>
          <tr>
            <th>Token Id</th>
            <th>Hash</th>
            <th>Key</th>
            <th>URI</th>
          </tr>
        </thead>
        <tbody>
        {
          list.length !== 0 ? 
            list.map((value, idx) => {
              return (
                <tr key={ idx }>
                  <td>{ value.tokenId }</td>
                  <td>{ value.hash.toString(CryptoJS.enc.Hex) }</td>
                  <td>{ value.key }</td>
                  <td>{ value.uri }</td>
                </tr>
              )
            })
          : <tr></tr>
          
        }
        </tbody>
      </table>
    </div>
  )
}



const Contract = () => {
  const {
    active,
  } = useWeb3React();
  return active ? (
    <div>
      <ContractviewList />
      <ContractUpload />
      <ContractDownload />
    </div>
  ) : <div></div>;
}

export default Contract;