// Composes the apiHost
export function apiHost(
  chainId: string = '1',
  network: string = 'testnet.',
  networkId: string = 'testnet04',
  apiVersion: string = '0.0',
): string {
  return `https://api.${network}chainweb.com/chainweb/${apiVersion}/${networkId}/chain/${chainId}/pact`;
}
