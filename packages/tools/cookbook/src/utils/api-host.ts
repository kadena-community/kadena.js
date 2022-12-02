/**
 * Composes the apiHost
 *
 * @export
 * @param {string} [chainId='1']
 * @param {string} [network='testnet.']
 * @param {string} [networkId='testnet04']
 * @param {string} [apiVersion='0.0']
 * @return {string}
 */
export function apiHost(
  chainId: string = '1',
  network: string = 'testnet.',
  networkId: string = 'testnet04',
  apiVersion: string = '0.0',
): string {
  return `https://api.${network}chainweb.com/chainweb/${apiVersion}/${networkId}/chain/${chainId}/pact`;
}
