export enum SearchType {
  GasEstimation = 'gasEstimation',
  Account = 'account',
  Block = 'block',
  Transactions = 'request-key',
  Event = 'event',
}

export const searchTypeLabels: Record<string, string> = {
  'request-key': 'Request Key',
  account: 'Account',
  event: 'Event Name',
  block: 'Block Hash',
  gasEstimation: 'Cmd',
};
export const secondSearchTypeLabels: Record<string, string> = {
  account: 'Module',
  gasEstimation: 'Hash',
};
export const thirdSeachTypeLabels: Record<string, string> = {
  gasEstimation: 'Signatures',
};
export const searchTypePlaceholders: Record<string, string> = {
  'request-key': 'vCiATVJgm7...',
  account: 'k:1234...',
  event: 'coin.TRANSFER',
  block: 'CA9orP2yM...',
  gasEstimation: 'cmd',
};

export const secondSearchFieldPlaceholders: Record<string, string> = {
  account: 'coin',
  gasEstimation: 'hash',
};

export const thirdSearchFieldPlaceholders: Record<string, string> = {
  gasEstimation: 'sigs',
};
