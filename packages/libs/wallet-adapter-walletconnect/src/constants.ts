import type { INetworkInfo } from '@kadena/wallet-adapter-core';

export const ERRORS = {
  PROVIDER_NOT_DETECTED: 'Provider not detected',

  FAILED_TO_CONNECT: 'Failed to connect',

  COULD_NOT_FETCH_ACCOUNT: 'Could not fetch account',

  KADENA_CHANGE_NETWORK_UNSUPPORTED:
    'kadena_changeNetwork is not supported by the WalletConnect extension',

  NETWORK_CANNOT_BE_SWITCHED: (network: INetworkInfo) =>
    `Network ${JSON.stringify(network.networkName)} cannot be switched - WalletConnect does not support programmatic network switching. Please change the network manually from your wallet.`,

  CONT_TRANSACTIONS_NOT_SUPPORTED: '`cont` transactions are not supported',

  NO_TRANSACTIONS_TO_SIGN: 'No transaction(s) to sign',

  NETWORK_MISMATCH: 'Network is not equal for all transactions',

  ERROR_SIGNING_TRANSACTION: 'Error signing transaction',

  TRANSACTION_HASH_MISMATCH: (expectedHash: string, walletHash: string) =>
    `Hash of the transaction signed by the wallet does not match. Our hash: ${expectedHash}, wallet hash: ${walletHash}`,

  FAILED_TO_PARSE: 'Failed to parse the transaction',
};
