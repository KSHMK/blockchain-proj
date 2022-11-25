import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config';
import { fileDownload } from './FileManage';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react'

const TokenDownload = ({isOpen, onClose, tokenId}) => {
  const [log, setLog] = useState('');
  const [id, setID] = useState('');

  async function download(){
    if(!active)
      return;
    const contract = new library.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS, {from:account});
    setLog("start contract");
    try{
      const key = await contract.methods.tokenKEY(id).call();
      const uri = await contract.methods.tokenURI(id).call();
      await fileDownload(key, uri, (a,b) => {setLog((a/b*100).toFixed())});
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
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create your account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          This is Test
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default TokenDownload;