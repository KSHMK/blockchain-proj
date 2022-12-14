import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Link,
  FormControl,
  FormLabel,
  Input,
  Icon,
  Checkbox,
  Popover,
  PopoverTrigger,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import { BiDownload, BiUpload, BiShieldQuarter } from "react-icons/bi";
import { getAdmin } from './ContractManage';

export default function NavBar({navState, setNavState, currentAccount, isAdmin}) {
  
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
            fontWeight="bold"
            fontSize={'3xl'}
            color={useColorModeValue('twitter.500', 'white')}>
            Audio Head
          </Text>
          
          { 
            navState !== 'login' ? (
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav setNavState={setNavState} isAdmin={isAdmin}/>
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
                fontWeight={500}
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

const DesktopNav = ({setNavState, isAdmin}) => {
  const linkColor = useColorModeValue('gray.800', 'twitter.500');
  const linkHoverColor = useColorModeValue('cyan.500', 'white');
  
  return (
    /*
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Button
                leftIcon={<BiDownload />}
                p={4}
                size={'lg'}
                onClick={() => {setNavState(navItem.state)}}
                fontSize={'larger'}
                fontWeight={500}
                color={linkColor}
                colorScheme='twitter'
                variant={'ghost'}
                >
                {navItem.label}
              </Button>
              
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}
    </Stack>
    */
   // mapping ?????? => ?????? icon ???????????????
    <Stack direction={'row'} spacing={4}>
    
        <Box key={'Upload Audio'}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Button
                leftIcon={<BiUpload />}                
                p={4}
                size={'lg'}
                onClick={() => {setNavState('upload')}}
                fontSize={'larger'}
                fontWeight={500}
                color={linkColor}
                colorScheme='twitter'
                variant={'ghost'}
                >
                Upload Audio
              </Button>
              
            </PopoverTrigger>
          </Popover>
        </Box>

        <Box key={'Download Audio'}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Button
                leftIcon={<BiDownload />}                
                p={4}
                size={'lg'}
                onClick={() => {setNavState('download')}}
                fontSize={'larger'}
                fontWeight={500}
                color={linkColor}
                colorScheme='twitter'
                variant={'ghost'}
                >
                Download Audio
              </Button>              
            </PopoverTrigger>
          </Popover>
        </Box>
        {
          isAdmin &&
            <Box key={'Admin Page'}>
              <Popover trigger={'hover'} placement={'bottom-start'}>
                <PopoverTrigger>
                  <Button
                    leftIcon={<BiShieldQuarter/>}                
                    p={4}
                    size={'lg'}
                    onClick={() => {setNavState('admin')}}
                    fontSize={'larger'}
                    fontWeight={500}
                    color={linkColor}
                    colorScheme='twitter'
                    variant={'ghost'}
                    >
                    Admin Page
                  </Button>              
                </PopoverTrigger>
              </Popover>
            </Box>
          
        }
    </Stack>
  );
};


