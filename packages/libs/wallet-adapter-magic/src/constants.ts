export const ERRORS = {
  PROVIDER_NOT_DETECTED: 'Provider not detected',
  FAILED_TO_CONNECT: 'Failed to connect',
  COULD_NOT_FETCH_ACCOUNT: 'Could not fetch account',
  KADENA_CHANGE_NETWORK_UNSUPPORTED:
    'kadena_changeNetwork_v1 is not supported by the Magic extension',
  ERROR_SIGNING_TRANSACTION: 'Error signing transaction',
  TRANSACTION_HASH_MISMATCH: (expectedHash: string, walletHash: string) =>
    `Hash of the transaction signed by the wallet does not match. Our hash: ${expectedHash}, wallet hash: ${walletHash}`,
  MAGIC_NOT_INITIALIZED: 'Magic wallet not initialized',
  INVALID_GUARD: 'Invalid guard',
};
