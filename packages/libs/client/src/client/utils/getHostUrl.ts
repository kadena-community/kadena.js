import { ChainId } from '@kadena/types';

import { INetworkOptions } from '../interfaces/interfaces';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const trimEnd = (subStr: string) => (str: string) =>
  str.endsWith(subStr) ? str.slice(0, str.length - subStr.length) : str;

// eslint-disable-next-line @rushstack/typedef-var
const removeSlash = trimEnd('/');

const getUrl = (baseUrl: string, networkId: string, chainId: ChainId): string =>
  `${removeSlash(baseUrl)}/chainweb/0.0/${networkId}/chain/${
    chainId ?? '1'
  }/pact`;

type HostsMap = Record<string, string | ((chianId: ChainId) => string)>;

type HostUrlGenerator = ({
  networkId,
  chainId,
}: Partial<INetworkOptions>) => string;

export const getHostUrl = (host?: string | HostsMap): HostUrlGenerator => {
  if (typeof host === 'string') {
    return ({ networkId, chainId }: Partial<INetworkOptions>) =>
      getUrl(host, networkId ?? 'mainnet01', chainId ?? '1');
  }
  const mapWithDefaults: HostsMap = {
    testnet04: 'https://api.testnet.chainweb.com',
    mainnet01: 'https://api.chainweb.com',
    ...host,
  };
  return ({ networkId, chainId }: Partial<INetworkOptions>) => {
    const baseUrl = mapWithDefaults[networkId ?? ''];
    if (
      typeof baseUrl !== 'function' &&
      (typeof baseUrl !== 'string' || baseUrl === '')
    ) {
      throw new Error('INVALID_BASE_URL');
    }
    return typeof baseUrl === 'function'
      ? baseUrl(chainId ?? '1')
      : getUrl(baseUrl, networkId ?? 'mainnet01', chainId ?? '1');
  };
};
