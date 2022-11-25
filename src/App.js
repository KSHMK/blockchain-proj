import { useEffect, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { connAccount, isConnected } from './ContractManage';

import NavBar from './Navbar';
import LoginPage from './LoginPage';
import TokenListView from './TokenList';
import TokenUpload from './TokenUpload';
import TokenDownload from './TokenDownload';



const App = () => {
  const [navState, setNavState] = useState('login');
  const [downTokenId, setDownTokenId] = useState(0);
  const [listUpdateToggle, setListUpdateToggle] = useState(false);
  const [currentAccount, setcurAccount] = useState('');

  const { isOpen:isOpenDownload, onToggle:onOpenDownload, onClose:onCloseDownload } = useDisclosure()
  const { isOpen:isOpenUpload, onOpen:onOpenUpload, onClose:onCloseUpload } = useDisclosure()
  
  const onOpenUploadFinish = () => {
    setListUpdateToggle(!listUpdateToggle);
    onCloseUpload();
  }

  const accountChangeHandler = (account) => {
    setcurAccount(account[0])
    setListUpdateToggle(!listUpdateToggle);
  }


  useEffect(() => {
    if(navState === 'login')
      return;
    if(navState === 'download')
      onOpenDownload();
    if(navState === 'upload')
      onOpenUpload();
    setNavState('list');
  },[navState, onOpenDownload, onOpenUpload])

  useEffect(() => {
    async function checkConnect() {
      const curAcnt = await isConnected();
      console.log(curAcnt);
      if(curAcnt){
        await connAccount(accountChangeHandler);
        setNavState('list');
        setcurAccount(curAcnt);
        return;
      }
    }
    checkConnect()
  })

  return (
    <>
      <NavBar navState={navState} setNavState={setNavState} currentAccount={currentAccount} />
      {
        navState !== 'login' ? <TokenListView listUpdateToggle={listUpdateToggle} onOpenDownload={onOpenDownload} setDownTokenId={setDownTokenId} /> :
        <LoginPage setNavState={setNavState} accountChangeHandler={accountChangeHandler} />
        
      }
      <TokenUpload isOpen={isOpenUpload} onClose={onOpenUploadFinish} />
      <TokenDownload isOpen={isOpenDownload} onClose={onCloseDownload} downTokenId={downTokenId} setDownTokenId={setDownTokenId} />
    </>
  )
}

export default App;
