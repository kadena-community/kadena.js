export enum SearchType {
  GasEstimation = 'gas-estimation',
  Account = 'account',
  NonFungibleAccount = 'non-fungible-account',
  Block = 'block',
  Transactions = 'request-key',
  Event = 'event',
}

export const searchTypeLabels: Partial<Record<SearchType, string>> = {
  'request-key': 'Request Key',
  account: 'Account',
  'non-fungible-account': 'Account',
  event: 'Event Name',
  block: 'Block Hash',
  'gas-estimation': 'Command',
};
export const secondSearchTypeLabels: Partial<Record<SearchType, string>> = {
  account: 'Fungible',
  'gas-estimation': 'Hash',
};
export const thirdSeachTypeLabels: Partial<Record<SearchType, string>> = {
  'gas-estimation': 'Signatures',
};
export const searchTypePlaceholders: Partial<Record<SearchType, string>> = {
  'request-key': 'vCiATVJgm7...',
  account: 'k:1234...',
  'non-fungible-account': 'k:1234...',
  event: 'coin.TRANSFER',
  block: 'CA9orP2yM...',
  'gas-estimation': '(coin.details k:1234...',
};

export const secondSearchFieldPlaceholders: Partial<
  Record<SearchType, string>
> = {
  account: 'coin',
  'gas-estimation': 'hash',
};

export const thirdSearchFieldPlaceholders: Partial<Record<SearchType, string>> =
  {
    'gas-estimation': 'signatures',
  };
