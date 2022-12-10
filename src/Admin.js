import { useState } from 'react';
import { getAdmin } from './ContractManage';

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

const AdminPage = ({isOpen, onClose}) => {
    
  
    return (
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Admin Page</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box py={{base:5}}>
              ADMIN
              
            </Box>

            
          </ModalBody>
  
          <ModalFooter>
            {/* <Button 
            isLoading={isDownload}
            loadingText='Downloading'
            colorScheme='blue' 
            mr={3} 
            onClick={download}>
              Start Download
            </Button> */}
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
  export default AdminPage;