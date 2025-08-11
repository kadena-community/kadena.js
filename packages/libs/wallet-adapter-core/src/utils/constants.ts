export const ERRORS = {
  CONT_TRANSACTIONS_NOT_SUPPORTED: '`cont` transactions are not supported',
  NO_TRANSACTIONS_TO_SIGN: 'No transaction(s) to sign',
  NETWORK_MISMATCH: 'Network is not equal for all transactions',
  ERROR_SIGNING_TRANSACTION: 'Error signing transaction',
  TRANSACTION_HASH_MISMATCH: (expectedHash: string, walletHash: string) =>
    `Hash of the transaction signed by the wallet does not match. Our hash: ${expectedHash}, wallet hash: ${walletHash}`,
};
