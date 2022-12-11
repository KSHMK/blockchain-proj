import { useState } from 'react';
import { withdraw, grantRole, revokeRole, setPrice } from './ContractManage';

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
  Input,
  Grid,
  GridItem,
  Heading
} from '@chakra-ui/react'

const AdminPage = ({isOpen, onClose}) => {
  const [isProgress, setIsProgress] = useState(false);
  const [roleAccount, setRoleAccount] = useState('');
  const [priceValue, setPriceValue] = useState(0.0);

  function onCloseClick() {
    if(isProgress)
      return;
    onClose();
  }

  async function setPriceEv() {
    if(isProgress)
      return;
    console.log("SetPrice")
    setIsProgress(true);
    await setPrice(priceValue * 1000000000000000000);
    setIsProgress(false);
  }
  
  async function withdrawEv() {
    if(isProgress)
      return;
    console.log("withdraw")
    setIsProgress(true);
    await withdraw();
    setIsProgress(false);
  }

  async function setViewRoleEv(mode) {
    if(isProgress)
      return;
    console.log("setRole")
    setIsProgress(true);
    if(mode)
      await grantRole(roleAccount);
    else
      await revokeRole(roleAccount);
    setIsProgress(false);
  }

  const setEnViewRole = () => {setViewRoleEv(true)};
  const setDisViewRole = () => {setViewRoleEv(false)};

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onCloseClick}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Admin Page</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
        <Box py={{base:1}}>
          <Heading size='md' py={{base:2}}>setPrice</Heading>
          <NumberInput defaultValue={0.000} onChange={(e) => setPriceValue(e)} step={0.001} allowMouseWheel
            value={priceValue + " Ether"}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Box py={{base:5}}>
            <Button isLoading={false}
              isDisabled={isProgress}
              loadingText='set Pricing'
              colorScheme='blue' 
              mr={3} 
              onClick={setPriceEv}>set Price</Button>
          </Box>
        </Box>
        <Box py={{base:1}}>
          <Heading size='md' py={{base:2}}>withdraw</Heading>
          <Box py={{base:5}}>
            <Button isLoading={false}
              isDisabled={isProgress}
              loadingText='withdrawing'
              colorScheme='blue' 
              mr={3} 
              onClick={withdrawEv}>withdraw</Button>
          </Box>
        </Box>
        <Box py={{base:1}}>
          <Heading size='md' py={{base:2}}>setting Role</Heading>
          <Input placeholder='Basic usage' value={roleAccount} onChange={(e) => setRoleAccount(e.target.value)}/>
          <Box py={{base:5}}>
            <Button isLoading={false}
              isDisabled={isProgress}
              loadingText='granting'
              colorScheme='blue' 
              mr={3} 
              onClick={setEnViewRole}>grant Role</Button>  

            <Button isLoading={false}
              isDisabled={isProgress}
              loadingText='revoking'
              colorScheme='blue' 
              mr={3} 
              onClick={setDisViewRole}>revoke Role</Button>
          </Box>
        </Box>
          
          
        </ModalBody>

        <ModalFooter>
          <Button isDisabled={isProgress} onClick={onCloseClick}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default AdminPage;