export const ERRORS = {
  PROVIDER_NOT_DETECTED: 'Provider not detected',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  FAILED_TO_VERIFY: (chainError: string): string =>
    `Failed to verify account on chain ${chainError}`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  METHOD_NOT_SUPPORTED: (method: string): string =>
    `Method ${method} not supported by Chainweaver adapter`,
  NETWORK_MISMATCH: 'Network is not equal for all transactions',
  ERROR_SIGNING_TRANSACTION: 'Error signing transaction',
};
