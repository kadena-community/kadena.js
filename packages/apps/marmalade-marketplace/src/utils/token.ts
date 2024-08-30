import { TokenMetadata } from '@/components/Token';

export const isValidURI = (uri: string): boolean => {
  try {
    const url = new URL(uri);

    switch (url.protocol) {
      case 'ipfs:':
      case 'arweave:':
      case 'http:':
      case 'https:':
        return true;
      default:
        return false;
    }
  } catch {
    return false;
  }
};

export const fetchData = async <Data = any>(
  uri: string,
): Promise<Data | null> => {
  try {
    const response = await fetch(uri);
    const metadata = await response.json();
    return metadata;
  } catch {
    return null;
  }
};

export const toIpfsGatewayUrl = (uri: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${uri.split('ipfs://')[1]}`;
};

export const toArweaveGatewayUrl = (uri: string): string => {
  return `https://arweave.net/${uri.split('arweave://')[1]}`;
};

export const getTokenMetadata = async (
  uri: string,
): Promise<TokenMetadata | null> => {
  if (!isValidURI(uri)) {
    return null;
  }

  if (uri.startsWith('ipfs:')) {
    return fetchData<TokenMetadata>(toIpfsGatewayUrl(uri));
  }

  if (uri.startsWith('arweave:')) {
    return fetchData<TokenMetadata>(toArweaveGatewayUrl(uri));
  }

  return fetchData<TokenMetadata>(uri);
};

export const getTokenImageUrl = (uri: string): string | null => {
  if (!isValidURI(uri)) {
    return null;
  }

  if (uri.startsWith('ipfs:')) {
    return toIpfsGatewayUrl(uri);
  }

  if (uri.startsWith('arweave:')) {
    return toArweaveGatewayUrl(uri);
  }

  return uri;
};
