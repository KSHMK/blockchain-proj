import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
} from '@chakra-ui/react';
import { connAccount } from './ContractManage';

export default function LoginPage({setNavState, accountChangeHandler}) {

  const connect = async () => {
    if(await connAccount(accountChangeHandler))
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
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Protect<br />
            <Text as={'span'} color={'green.400'}>
              your Audio
            </Text>
          </Heading>
          <Text color={'gray.500'} fontSize={'3xl'}>
            Connect to the Metamask by getting started
          </Text>
          
          
          <Button
            onClick={() => connect()}
            alignSelf={'center'}
            flex h="6vh"
            fontSize={'2xl'}
            fontWeight="bold"
            rounded={'full'}
            colorScheme={'cyan'}
            px={10}
            color={'white'}
           >
            Get Started
          </Button>
        </Stack>
      </Container>
    </>
  );
}

// 시작문구, 설명 문구 추가
// 버튼 디자인 수정