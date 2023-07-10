export const apiHost = (
  chainId: string,
  network: string = '',
  networkId: string = 'mainnet01',
  apiVersion: string = '0.0',
): string => {
  return `https://api.${network}chainweb.com/chainweb/${apiVersion}/${networkId}/chain/${chainId}/pact`;
};

export const testnetChain1ApiHost: string = apiHost(
  '1',
  'testnet.',
  'testnet04',
);
