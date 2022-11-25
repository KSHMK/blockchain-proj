import {
  Box,
  Heading,
  Container,
  Button,
  Stack,
} from '@chakra-ui/react';
import { connAccount } from './ContractManage';

export default function LoginPage({setNavState}) {

  const connect = async () => {
    if(await connAccount())
      setNavState('list');
  }

  return (
    <>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
          >
          
          <Heading>Welcome</Heading>  
          <Button
            onClick={() => connect()}
            alignSelf={'center'}
            rounded={'full'}
            colorScheme={'cyan'}
            px={6}>
            Get Started
          </Button>
        </Stack>
      </Container>
    </>
  );
}
