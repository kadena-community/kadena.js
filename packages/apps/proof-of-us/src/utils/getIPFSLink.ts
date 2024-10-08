import { env } from './env';

export const getIPFSLink = (uri: string): string => {
  // check nftstorage

  // check ipfs.io
  // const ipfsIORegExp = /(?:https:\/\/)ipfs\.io\/ipfs\/(.+)/;
  // const match2 = uri.match(ipfsIORegExp);
  // if (match2) {
  //   return `${env.URL}/pinata/${match2[1]}`;
  // }

  if (uri.includes('localhost' ?? '')) return uri;
  const idAndTypeRegExp =
    /(?:https:\/\/)?([^\/.]+)\.ipfs\.(nftstorage|dweb)\.link\/(.+)/;
  const idAndTypeRegExp2 = /https:\/\/ipfs\.io\/ipfs\/(.+)/;
  const match = uri.match(idAndTypeRegExp);

  if (match) {
    return `${env.URL}/api/ipfs/${match[1]}/${match[2]}/${match[3]}`;
  }

  const match2 = uri.match(idAndTypeRegExp2);
  if (match2) {
    return `${env.URL}/pinata/${match2[1]}`;
  }

  return uri;
};
