/**
 * Composes the apiHost
 *
 * @param [chainId='1']
 * @param [network='testnet.']
 * @param [networkId='testnet04']
 * @param [apiVersion='0.0']
 * @return
 */
export function apiHost(
  chainId: string = '1',
  network: string = 'testnet.',
  networkId: string = 'testnet04',
  apiVersion: string = '0.0',
): string {
  return `https://api.${network}chainweb.com/chainweb/${apiVersion}/${networkId}/chain/${chainId}/pact`;
}
