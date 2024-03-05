export enum SearchType {
  GasEstimation = 'gas-estimation',
  Account = 'account',
  Block = 'block',
  Transactions = 'request-key',
  Event = 'event',
}

export const searchTypeLabels: Partial<Record<SearchType, string>> = {
  'request-key': 'Request Key',
  account: 'Account',
  event: 'Event Name',
  block: 'Block Hash',
  'gas-estimation': 'Input',
};

export const searchTypePlaceholders: Partial<Record<SearchType, string>> = {
  'request-key': 'vCiATVJgm7...',
  account: 'k:1234...',
  event: 'coin.TRANSFER',
  block: 'CA9orP2yM...',
  'gas-estimation': '{ cmd:... / (coin.details k:1234...',
};
