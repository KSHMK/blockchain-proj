import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Link,
  Popover,
  PopoverTrigger,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';

export default function NavBar({navState, setNavState, currentAccount}) {
  
  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}>
            Audio Head
          </Text>
          
          { 
            navState !== 'login' ? (
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav setNavState={setNavState}/>
            </Flex>
            ) : <></>
          }
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          { 
            navState !== 'login' ? (
              <Button
                as={'a'}
                fontSize={'sm'}
                fontWeight={400}
                pointerEvents={'none'}
                href={'#'}>
                Current Account: {currentAccount}
              </Button>
            ) : <></>
          }
        </Stack>
      </Flex>
    </Box>
  );
}

const DesktopNav = ({setNavState}) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  
  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                onClick={() => {setNavState(navItem.state)}}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                {navItem.label}
              </Link>
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};


const NAV_ITEMS = [
  {
    label: 'Upload Audio',
    state: 'upload',
  },
  {
    label: 'Download Audio',
    state: 'download',
  },

];