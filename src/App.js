import { useEffect, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { connAccount, getAdmin, isConnected } from './ContractManage';

import NavBar from './Navbar';
import LoginPage from './LoginPage';
import TokenListView from './TokenList';
import TokenUpload from './TokenUpload';
import TokenDownload from './TokenDownload';
import AdminPage from './Admin';



const App = () => {
  const [navState, setNavState] = useState('login');
  const [downTokenId, setDownTokenId] = useState(0);
  const [listUpdateToggle, setListUpdateToggle] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentAccount, setcurAccount] = useState('');

  const { isOpen:isOpenDownload, onToggle:onOpenDownload, onClose:onCloseDownload } = useDisclosure()
  const { isOpen:isOpenUpload, onOpen:onOpenUpload, onClose:onCloseUpload } = useDisclosure()
  const { isOpen:isOpenAdmin, onOpen:onOpenAdmin, onClose:onCloseAdmin } = useDisclosure()
  
  const onOpenUploadFinish = () => {
    setListUpdateToggle(!listUpdateToggle);
    console.log(listUpdateToggle)
    onCloseUpload();
  }

  const accountChangeHandler = (account) => {
    checkConnect();
    setListUpdateToggle(!listUpdateToggle);

  }

  useEffect(() => {
    if(typeof window.ethereum !== 'undefined')
      window.ethereum.on('accountsChanged', accountChangeHandler);
    return () => {
      window.ethereum.removeListener('accountsChanged', accountChangeHandler);
    }
  })

  useEffect(() => {
    if(navState === 'login')
      return;
    if(navState === 'download')
      onOpenDownload();
    if(navState === 'upload')
      onOpenUpload();
    if(navState === 'admin')
      onOpenAdmin();
  
    setNavState('list');
  },[navState, onOpenDownload, onOpenUpload])

  async function checkConnect() {
    const curAcnt = await isConnected();
    
    if(curAcnt){
      await connAccount();
      const admin = await getAdmin();
      setNavState('list');
      setcurAccount(curAcnt);
      console.log(curAcnt);
      console.log(admin);
      console.log(curAcnt === admin);
      if(curAcnt === admin)
      {
        console.log("admin");
        setIsAdmin(true);
      }
      else
        setIsAdmin(false);
      return;
    }
  }

  useEffect(() => {
    
    checkConnect()
  }, [])

  return (
    <>
      <NavBar navState={navState} setNavState={setNavState} currentAccount={currentAccount} isAdmin={isAdmin} />
      {
        navState !== 'login' ? <TokenListView listUpdateToggle={listUpdateToggle} onOpenDownload={onOpenDownload} setDownTokenId={setDownTokenId} /> :
        <LoginPage setNavState={setNavState} accountChangeHandler={accountChangeHandler} />
        
      }
      <TokenUpload isOpen={isOpenUpload} onClose={onOpenUploadFinish} />
      <TokenDownload isOpen={isOpenDownload} onClose={onCloseDownload} downTokenId={downTokenId} setDownTokenId={setDownTokenId} />
      <AdminPage isOpen={isOpenAdmin} onClose={onCloseAdmin} />
    </>
  )
}

export default App;
