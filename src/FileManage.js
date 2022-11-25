import CryptoJS from 'crypto-js';
import { create } from 'ipfs-http-client';
import { Buffer } from "buffer";
import { getTokenKeyURI } from './ContractManage';

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
  const file_data = CryptoJS.enc.Latin1.parse(await readFileAsync(selectedFile));
  const hash = CryptoJS.SHA256(file_data).toString(CryptoJS.enc.Hex);
  
  const key = CryptoJS.lib.WordArray.random(256/8);
  const iv = CryptoJS.lib.WordArray.random(128/8);
  const keyiv = CryptoJS.enc.Base64.stringify(key)+"-"+CryptoJS.enc.Base64.stringify(iv);

  const encrypted = CryptoJS.AES.encrypt(file_data, key, {
    iv:iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });
  const encryptedFile = new File([encrypted], selectedFile.name + '.encrypted', {type: selectedFile.type, lastModified: selectedFile.lastModified});

  const client = getIpfsClient();
  
  const ipfs_file_data = await client.add(encryptedFile, {progress:(bytes) => {progress(bytes,encryptedFile.size)}});

  const metadata = JSON.stringify({
    name:selectedFile.name,
    type:selectedFile.type,
    mtime:selectedFile.lastModified,
    url:ipfs_file_data.path,
    size:ipfs_file_data.size
  });

  const ipfs_meta_data = await client.add(metadata);


  return {
    hash:hash,
    key:keyiv,
    path:ipfs_meta_data.path
  };
};

export const fileRemove = async (path) => {
  const client = getIpfsClient();
  await client.pin.rm(path);
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
  }
  }

  return out;
}

export const fileDownload = async (tokenid, progress=() => {}) => {
  const keyuri = await getTokenKeyURI(tokenid);
  if(!keyuri)
    return false;
  
  const keyiv = keyuri.key
  const path = keyuri.uri;
  console.log(keyiv,path);
  const client = getIpfsClient();
  let metadataStr = "";
  for await (const entry of client.cat(path)) {
    metadataStr += String.fromCharCode.apply(null, entry)
  }

  const metadata = JSON.parse(metadataStr);

  let dataArr = []
  let len = 0;
  
  for await (const entry of client.cat(metadata.url)) {
    console.log(entry)
    len += entry.length;
    dataArr.push(...[entry]);
    progress(len, metadata.size);
  }

  let length = 0;
  dataArr.forEach(item => {
    length += item.length;
  });

  // Create a new array with total length and merge all source arrays.
  let encData = new Uint8Array(length);
  let offset = 0;
  dataArr.forEach(item => {
    encData.set(item, offset);
    offset += item.length;
  });
  
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
  return true;
};