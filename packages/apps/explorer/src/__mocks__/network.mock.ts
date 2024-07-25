import type { INetwork } from '@/constants/network';

export const networkConstants: INetwork[] = [
  {
    networkId: 'greyskull',
    label: 'He-man',
    slug: 'heman',
    chainwebUrl: 'api.chainweb.com',
    graphUrl: 'https://graph.kadena.network/graphql',
    wsGraphUrl: 'https://graph.kadena.network/graphql',
    explorerUrl: 'https://explorer.kadena.io/',
  },
];
