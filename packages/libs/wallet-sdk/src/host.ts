interface IWalletHostOptions {
  networkId: string;
  chainId: string;
}

export type HostAddressGenerator = (options: IWalletHostOptions) => string;

const networkHostMap: Record<string, string | string[]> = {
  mainnet01: 'https://api.chainweb.com',
  testnet04: 'https://api.testnet.chainweb.com',
  testnet05: 'https://api.testnet.chainweb.com',
};

export const defaultHostAddressGenerator: HostAddressGenerator = (options) => {
  return `${networkHostMap[options.networkId]}/chainweb/0.0/${options.networkId}/chain/${options.chainId}/pact`;
};

// Example client usage:
// import { createClient } from "@kadena/client";

// const hostMap: Record<string, string> = {
//   mainnet01: 'https://api.chainweb.com',
//   mainnet04: 'https://api.testnet.chainweb.com',
//   mainnet05: 'https://api.testnet.chainweb.com',
// };

// const client = createClient(
//   ({ networkId, chainId }) =>
//     `${hostMap[networkId]}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
// );
