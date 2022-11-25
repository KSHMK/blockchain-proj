import { useState } from 'react';
import { fileUpload } from './FileManage';

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
  Input,
  Box,
  Text,
  Grid,
  GridItem,
} from '@chakra-ui/react'

const ContractUpload = ({isOpen, onClose}) => {

  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);


  const changeHandler = (event) => {
    if(event.target.files[0] === undefined){
      setIsSelected(false);
      return;
    }
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  function onCloseClick() {
    onClose();
    setMsg('');
    setProgress(0);
  }

  function processLog(msg, p, toP) {
    setMsg(msg);
    setProgress((p/toP*100).toFixed());
  }

  async function upload(){
    if(!isSelected)
      return;
    
    try{
      await fileUpload(selectedFile, processLog);
    } catch(err) {
      setMsg("Failed");
      return;
    }
    setMsg("Success");
  }

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onCloseClick}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Audio</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box py={{base:5}}>
            Upload File
            <Input type="file" name="file" onChange={changeHandler} accept="audio/*" />
          </Box>
          <Box py={{base:5}}>
          <Grid gap={4}>
            <GridItem colSpan={1}><Text>{msg}</Text></GridItem> 
            <GridItem colSpan={1}><Progress value={progress} size='lg'/></GridItem>
          </Grid>
          </Box>
          
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={upload}>
            Start Upload
          </Button>
          <Button onClick={onCloseClick}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default ContractUpload;