import type { Network } from '../types';
import { nanoid } from 'nanoid';

export default function createDefaultNetworks(): Network[] {
  return [
    {
      id: nanoid(),
      name: 'Kadena Mainnet',
      networkId: 'mainnet01',
      blockExplorerTransaction:
        'https://explorer.chainweb.com/mainnet/tx/[[txHash]]',
      blockExplorerAddress:
        'https://explorer.chainweb.com/mainnet/account/[[address]]?token=coin',
      blockExplorerAddressTransactions:
        'https://explorer.chainweb.com/mainnet/transfer/[[address]]?token=coin',
      isTestnet: false,
      nodeUrl: 'https://api.chainweb.com/chainweb/0.0',
      transactionListUrl: 'https://graph.kadena.network/graphql',
      transactionListTtl: 30000,
      buyPageUrl: 'https://buy.simplex.com/?crypto=KDA',
    },
    {
      id: nanoid(),
      name: 'Kadena Testnet',
      networkId: 'testnet04',
      blockExplorerTransaction:
        'https://explorer.chainweb.com/testnet/tx/[[txHash]]',
      blockExplorerAddress:
        'https://explorer.chainweb.com/testnet/account/[[address]]?token=coin',
      blockExplorerAddressTransactions:
        'https://explorer.chainweb.com/testnet/transfer/[[address]]?token=coin',
      isTestnet: true,
      nodeUrl: 'https://api.testnet.chainweb.com/chainweb/0.0',
      transactionListUrl: 'https://graph.testnet.kadena.network/graphql',
      transactionListTtl: 30000,
      buyPageUrl: 'https://faucet.testnet.chainweb.com',
    },
  ];
}
