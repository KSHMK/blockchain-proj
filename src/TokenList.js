import { useEffect, useState } from 'react';
import { getTokenList } from './ContractManage';

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
} from '@chakra-ui/react'

export const TokenListView = ({listUpdateToggle, onOpenDownload, setDownTokenId}) => {
  
  const [list, setList] = useState([])

  async function clickRow(tokenId) {
    setDownTokenId(tokenId);
    onOpenDownload();
  }

  async function viewList() {
    getTokenList()
      .then((data) => {setList(data);})
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    viewList();
  }, [listUpdateToggle]);

  return (
    <Box 
    maxH="30em" 
    overflowY="scroll"
    px={{base:20}}
    py={{base:10}}>
      <Heading py={{base:5}}> Token List</Heading>
      <Table size={'lg'}>
        <Thead>
          <Tr>
            <Th fontWeight={'bold'} fontSize={'md'}>Token Id</Th>
            <Th fontWeight={'bold'} fontSize={'md'}>Name</Th>
            <Th fontWeight={'bold'} fontSize={'md'}>Hash</Th>
          </Tr>
        </Thead>
        <Tbody>
        {
          list.length !== 0 ? 
            list.map((value, idx) => {
              return (
                <Tr key={ idx } onClick={() => clickRow(value.tokenId)}>
                  <Td>{ value.tokenId }</Td>
                  <Td>{ value.name }</Td>
                  <Td>{ value.hash }</Td>
                </Tr>
              )
            })
          : <Tr><Td colSpan={3} fontWeight={'bold'} fontSize={'lg'}>None</Td></Tr>
          
        }
        </Tbody>
      </Table>
    </Box>
  )
}

export default TokenListView