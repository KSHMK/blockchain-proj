import { useEffect, useState } from 'react';
import { fileDownload } from './FileManage';
import { getTokenList } from './ContractManage';

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
} from '@chakra-ui/react'

export const TokenListView = () => {
  
  const [list, setList] = useState([])
  const [Log, setLog] = useState('')
  let flag=false;


  async function viewList() {
    if(flag)
      return;
    flag = true;
    const tlist = await getTokenList();
    setList(tlist);
  }

  useEffect(() => {
    viewList();
  }, []);

  return (
    <Box 
    maxH="30em" 
    overflowY="scroll"
    px={{base:20}}
    py={{base:10}}>
      <Heading py={{base:5}}>Token List</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Token Id</Th>
            <Th>Hash</Th>
            <Th>URI</Th>
          </Tr>
        </Thead>
        <Tbody>
        {
          list.length !== 0 ? 
            list.map((value, idx) => {
              return (
                <Tr key={ idx } onClick={() => fileDownload(value.key, value.uri,(a,b) => {setLog((a/b*100).toFixed())})}>
                  <Td>{ value.tokenId }</Td>
                  <Td>{ value.hash }</Td>
                  <Td>{ value.uri }</Td>
                </Tr>
              )
            })
          : <Tr><Td colSpan={3}>None</Td></Tr>
          
        }
        </Tbody>
      </Table>
    </Box>
  )
}
