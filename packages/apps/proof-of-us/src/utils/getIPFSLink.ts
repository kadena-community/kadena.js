import { env } from './env';

export const getIPFSLink = (uri: string): string => {
  // check nftstorage
  const idAndTypeRegExp =
    /(?:https:\/\/)?([^\/.]+)\.ipfs\.(nftstorage|dweb)\.link\/(.+)/;
  const match = uri.match(idAndTypeRegExp);

  if (match) {
    return `${env.URL}/api/ipfs/${match[1]}/${match[2]}/${match[3]}`;
  }

  // check ipfs.io
  const ipfsIORegExp = /(?:https:\/\/)ipfs\.io\/ipfs\/(.+)/;
  const match2 = uri.match(ipfsIORegExp);
  if (match2) {
    console.log(`${env.URL}/api/ipfsio/${match2[1]}`);
    return `${env.URL}/api/ipfsio/${match2[1]}`;
  }

  return uri;
};
