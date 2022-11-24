import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config';
import { fileRemove, fileUpload } from './FileManage';

const ContractUpload = () => {

  const [log, setLog] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);

  const {
    library,
    account,
    active,
  } = useWeb3React();

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  async function upload(){
    if(!active)
      return;
    
    let file = undefined;
    try{
      file = await fileUpload(selectedFile);
      const contract = new library.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS, {from:account});
      const mint_price = await contract.methods.mintPrice().call();
      console.log(mint_price);
      const out = await contract.methods.addAudio(file.hash, file.key, file.path).send({value:mint_price});
      console.log(out);
    } catch(err) {
      console.log(err);
      if(file !== undefined)
        await fileRemove(file.path);
      setLog("upload failed");
      return;
    }
    setLog("upload success");
  }

  return (
    <div>
      <hr />
      <p>Upload</p>
      <input type="file" name="file" onChange={changeHandler} accept="audio/*" />
            {isSelected ? (
                <div>
                    <p>Filename: {selectedFile.name}</p>
                    <p>Filetype: {selectedFile.type}</p>
                    <p>Size in bytes: {selectedFile.size}</p>
                    <p>
                        lastModifiedDate:{' '}
                        {selectedFile.lastModifiedDate.toLocaleDateString()}
                    </p>
                </div>
            ) : (
                <p>Select a file to show details</p>
            )}
            <button type="button" onClick={upload}>Submit</button>
      <p>{log}</p>
    </div>
  )
}
export default ContractUpload;