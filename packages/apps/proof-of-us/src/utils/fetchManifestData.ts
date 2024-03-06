import { getIPFSLink } from './getIPFSLink';

export const fetchManifestData = async (
  uri?: string,
): Promise<IProofOfUsTokenMeta | undefined> => {
  if (!uri) return;
  const ipfsUri = getIPFSLink(uri);
  const result = await fetch(ipfsUri);
  const data = (await result.json()) as IProofOfUsTokenMeta;

  return data;
};
