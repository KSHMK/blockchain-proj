import { useEffect, useState } from 'react';
import { TokenListView } from './TokenList';
import NavBar from './Navbar';
import LoginPage from './LoginPage';
import TokenDownload from './TokenDownload';
import { isConnected } from './ContractManage';
import { useDisclosure } from '@chakra-ui/react';

const App = () => {
  const [navState, setNavState] = useState('login');
  const { isOpen:isOpenDownload, onToggle:onOpenDownload, onClose:onCloseDownload } = useDisclosure()
  const { isOpen:isOpenUpload, onOpen:onOpenUpload, onClose:onCloseUpload } = useDisclosure()
  
  useEffect(() => {
    if(navState === 'download')
      onOpenDownload();
    if(navState === 'upload')
      onOpenUpload();
  },[navState])

  useEffect(() => {
    async function checkConnect() {
      if(await isConnected())
        setNavState('list');
    }
    checkConnect()
  },[])

  return (
    <>
      <NavBar navState={navState} setNavState={setNavState} />
      {
        navState === 'login' ? <LoginPage setNavState={setNavState}/> : <TokenListView onOpenDownload={onOpenDownload} />
      }
      <TokenDownload isOpen={isOpenDownload} onClose={onCloseDownload} />
    </>
  )
}

export default App;
