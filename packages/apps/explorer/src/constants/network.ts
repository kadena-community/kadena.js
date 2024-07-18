export interface INetwork {
  networkId: string;
  label: string;
  slug: string;
  chainwebUrl: string;
  graphUrl: string;
  wsGraphUrl: string;
  explorerUrl?: string;
}

export const networkConstants: INetwork[] = [
  {
    networkId: 'mainnet01',
    label: 'Mainnet',
    slug: 'mainnet',
    chainwebUrl: 'api.chainweb.com',
    graphUrl: 'https://graph.kadena.network/graphql',
    wsGraphUrl: 'https://graph.kadena.network/graphql',
    explorerUrl: 'https://explorer.kadena.io/',
  },
  {
    networkId: 'testnet04',
    label: 'Testnet',
    slug: 'testnet',
    chainwebUrl: 'api.testnet.chainweb.com',
    graphUrl: 'https://graph.testnet.kadena.network/graphql',
    wsGraphUrl: 'https://graph.testnet.kadena.network/graphql',
    explorerUrl: 'https://explorer.testnet.kadena.io/',
  },
];
