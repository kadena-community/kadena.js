import type { Network } from '../types/index';
import { text, } from '@metamask/snaps-ui';

export default function renderNetwork(network: Network) {
  const {
    name,
    networkId,
    nodeUrl,
    isTestnet,
    transactionListTtl,
    transactionListUrl,
    blockExplorerAddress,
    blockExplorerTransaction,
    blockExplorerAddressTransactions,
  } = network;
  return [
    text(`**Network name: ${name}**`),
    text(`Network ID: ${networkId}`),
    text(`Testnet? ${isTestnet? "yes" : "no"}`),
    text(`Node URL: ${nodeUrl}`),
    text(`Transaction list TTL: ${transactionListTtl}`),
    text(`Transaction list URL: ${transactionListUrl}`),
    text(`Explorer Address URL: ${blockExplorerAddress}`),
    text(`Explorer Transaction URL: ${blockExplorerTransaction}`),
    text(`Explorer Address Transactions URL: ${blockExplorerAddressTransactions}`),
  ];
}
