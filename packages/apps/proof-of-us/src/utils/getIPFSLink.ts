//import { env } from './env';

export const getIPFSLink = (uri: string): string => {
  // check nftstorage

  // check ipfs.io
  // const ipfsIORegExp = /(?:https:\/\/)ipfs\.io\/ipfs\/(.+)/;
  // const match2 = uri.match(ipfsIORegExp);
  // if (match2) {
  //   return `${env.URL}/pinata/${match2[1]}`;
  // }

  // const idAndTypeRegExp =
  //   /(?:https:\/\/)?([^\/.]+)\.ipfs\.(nftstorage|dweb)\.link\/(.+)/;
  // const match = uri.match(idAndTypeRegExp);

  // if (match) {
  //   return `${env.URL}/api/ipfs/${match[1]}/${match[2]}/${match[3]}`;
  // }

  // if (
  //   uri.startsWith('https://ipfs.io') ||
  //   uri.startsWith('https://jade-voluntary-tiglon-98.mypinata.cloud') ||
  //   uri.startsWith(process.env.NEXT_PUBLIC_PINATA_DOMAIN ?? '')
  // ) {
  //   const arr = uri.split('/');
  //   return `${env.URL}/pinata/${arr[arr.length - 1]}`;
  // }

  return uri;
};
