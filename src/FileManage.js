import CryptoJS from 'crypto-js';
import { create } from 'ipfs-http-client';
import { Buffer } from "buffer";

const readFileAsync = (file) => {
  return  new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(CryptoJS.enc.Latin1.parse(reader.result));
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

export const fileUpload = async (selectedFile) => {
  const file_data = await readFileAsync(selectedFile);
  const hash = CryptoJS.SHA256(file_data).toString(CryptoJS.enc.Hex);
  
  const key = CryptoJS.lib.WordArray.random(256/8).toString(CryptoJS.enc.Hex);

  console.log(file_data);
  const encrypted = CryptoJS.AES.encrypt(file_data, key);
  const encryptedFile = new File([encrypted], selectedFile.name + '.encrypted', {type: selectedFile.type, lastModified: selectedFile.lastModified});

  const client = getIpfsClient();
  let ipfs_data;
  
  ipfs_data = await client.add(encryptedFile);

  return {
    hash:hash,
    key:key,
    path:ipfs_data.path
  };
};

export const fileRemove = async (path) => {
  const client = getIpfsClient();
  await client.pin.rm(path);
}

export const fileDownload = async (key, path) => {
};