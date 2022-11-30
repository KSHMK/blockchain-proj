import { useState } from 'react';
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
  Progress,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  Text,
  Grid,
  GridItem,
} from '@chakra-ui/react'

const TokenDownload = ({isOpen, onClose, downTokenId, setDownTokenId}) => {
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState('');
  const [isDownload, setIsDownload] = useState(false);

  function processLog(msg, p, toP) {
    setMsg(msg);
    setProgress((p/toP*100).toFixed());
  }

  function onCloseClick() {
    if(isDownload)
      return;
    onClose();
    setMsg('');
    setProgress(0);
  }

  async function download(){
    if(isDownload)
      return;
    setIsDownload(true);
    try{
      const result = await fileDownload(downTokenId, processLog);
      
      if(!result)
        setMsg("Failed");
      else
        setMsg("Success");
    } catch(err) {
      setMsg("Failed");
    }
    setIsDownload(false);

  }


  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onCloseClick}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Download Audio</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box py={{base:5}}>
            Download Token ID
            <NumberInput defaultValue={downTokenId} onChange={(e) => setDownTokenId(e)}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Box py={{base:5}}>
          <Grid gap={4}>
            <GridItem colSpan={1}><Text>{msg}</Text></GridItem> 
            <GridItem colSpan={1}><Progress value={progress} size='lg'/></GridItem>
          </Grid>
          </Box>
          
        </ModalBody>

        <ModalFooter>
          <Button 
          isLoading={isDownload}
          loadingText='Downloading'
          colorScheme='blue' 
          mr={3} 
          onClick={download}>
            Start Download
          </Button>
          <Button isDisabled={isDownload} onClick={onCloseClick}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default TokenDownload;