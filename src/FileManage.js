import CryptoJS from 'crypto-js';
import { create } from 'ipfs-http-client';
import { Buffer } from "buffer";
import { getTokenKeyURI, setToken } from './ContractManage';

const readFileAsync = (file) => {
  return  new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  })
};

const getIpfsClient = () => {
  const auth = 'Basic ' + Buffer.from(process.env.REACT_APP_PROJECT_ID + ':' + process.env.REACT_APP_API_KEY).toString('base64');
  return create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
          authorization: auth,
      },
  });
}

export const fileUpload = async (selectedFile, progress=() => {}) => {
  progress("Reading file", 0, 1);
  const file_data = CryptoJS.enc.Latin1.parse(await readFileAsync(selectedFile));
  const hash = CryptoJS.SHA256(file_data).toString(CryptoJS.enc.Hex);
  
  progress("Encrypting file", 0, 1);
  const key = CryptoJS.lib.WordArray.random(256/8);
  const iv = CryptoJS.lib.WordArray.random(128/8);
  const keyiv = CryptoJS.enc.Base64.stringify(key)+"-"+CryptoJS.enc.Base64.stringify(iv);

  const encrypted = CryptoJS.AES.encrypt(file_data, key, {
    iv:iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });
  const encryptedFile = new File([encrypted], selectedFile.name + '.encrypted', {type: selectedFile.type, lastModified: selectedFile.lastModified});

  const ipfs = getIpfsClient();
  let ipfs_file_data;
  try{
    ipfs_file_data = await ipfs.add(encryptedFile, {progress:(bytes) => {progress("Uploading File",bytes,encryptedFile.size)}});
  } catch(err) {
    return false;
  }

  progress("Uploading metadata", 1, 1);
  const metadata = JSON.stringify({
    name:selectedFile.name,
    type:selectedFile.type,
    mtime:selectedFile.lastModified,
    url:ipfs_file_data.path,
    size:ipfs_file_data.size
  });

  let ipfs_meta_data;
  try{
    ipfs_meta_data = await ipfs.add(metadata);
  } catch(err) {
    await fileRemove(ipfs_file_data.path);
    return false;
  }

  progress("NFT Tokenising", 1, 1);

  if(!await setToken(hash, keyiv, ipfs_meta_data.path))
  {
    await fileRemove(ipfs_file_data.path);
    await fileRemove(ipfs_meta_data.path);
    return false;
  }
  return true;
};

export const fileRemove = async (path) => {
  const ipfs = getIpfsClient();
  await ipfs.pin.rm(path);
}

function Utf8ArrayToStr(array) {
  var out, i, len, c;
  var char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while(i < len) {
  c = array[i++];
  switch(c >> 4)
  { 
    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
      // 0xxxxxxx
      out += String.fromCharCode(c);
      break;
    case 12: case 13:
      // 110x xxxx   10xx xxxx
      char2 = array[i++];
      out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
      break;
    case 14:
      // 1110 xxxx  10xx xxxx  10xx xxxx
      char2 = array[i++];
      char3 = array[i++];
      out += String.fromCharCode(((c & 0x0F) << 12) |
                     ((char2 & 0x3F) << 6) |
                     ((char3 & 0x3F) << 0));
      break;
    default:
      break;
  }
  }

  return out;
}

export const fileMetadata = async (path) => {
  const ipfs = getIpfsClient();
  let metadataStr = "";
  for await (const entry of ipfs.cat(path)) {
    metadataStr += String.fromCharCode.apply(null, entry)
  }
  return JSON.parse(metadataStr);
}

export const fileDownload = async (tokenid, progress=() => {}) => {
  const keyuri = await getTokenKeyURI(tokenid);
  if(!keyuri)
    return false;
  
  const keyiv = keyuri.key
  const path = keyuri.uri;
  
  progress("Downloading metadata", 0, 1);
  const metadata = await fileMetadata(path);

  const ipfs = getIpfsClient();
  
  let dataArr = []
  let len = 0;
  
  for await (const entry of ipfs.cat(metadata.url)) {
    console.log(entry)
    len += entry.length;
    dataArr.push(...[entry]);
    progress("Downloading",len, metadata.size);
  }

  let length = 0;
  dataArr.forEach(item => {
    length += item.length;
  });


  progress("Merge download data", 1, 1);
  // Create a new array with total length and merge all source arrays.
  let encData = new Uint8Array(length);
  let offset = 0;
  dataArr.forEach(item => {
    encData.set(item, offset);
    offset += item.length;
  });
  
  progress("Decrypted file", 1, 1);
  const encDataWA = Utf8ArrayToStr(encData);
  const keyivP = keyiv.split("-");
  const key = CryptoJS.enc.Base64.parse(keyivP[0]);
  const iv = CryptoJS.enc.Base64.parse(keyivP[1]);

  const decrypted = CryptoJS.AES.decrypt(encDataWA, key,{
    iv:iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });

  const uint32 = new Uint32Array(decrypted.words);
  const decData = new Uint8Array(uint32.buffer, 0, decrypted.sigBytes);  
  const file = new File([decData], metadata.name, {type: metadata.type, lastModified: metadata.mtime});

  const anchorElement = document.createElement('a');
  document.body.appendChild(anchorElement);
  anchorElement.download = file.name;
  anchorElement.href = URL.createObjectURL(file);
  anchorElement.click(); 
  document.body.removeChild(anchorElement); 
  progress("Finish", 1, 1);
  return true;
};