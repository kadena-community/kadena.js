import { env } from './env';

export const getIPFSLink = (uri: string): string => {
  const idAndTypeRegExp =
    /(?:https:\/\/)?([^\/.]+)\.ipfs\.nftstorage\.link\/(.+)/;
  const match = uri.match(idAndTypeRegExp);

  if (!match) return uri;

  return `${env.URL}/api/ipfs/${match[1]}/${match[2]}`;
};
