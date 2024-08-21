export const SEARCHOPTIONS = {
  ACCOUNT: 'ACCOUNT',
  REQUESTKEY: 'REQUESTKEY',
  BLOCKHASH: 'BLOCKHASH',
  BLOCKHEIGHT: 'BLOCKHEIGHT',
  EVENT: 'EVENT',
} as const;

export type SearchOptionEnum = keyof typeof SEARCHOPTIONS;

export const NETWORKTYPES = {
  Devnet: 'Devnet',
  Mainnet: 'Mainnet',
  Testnet: 'Testnet',
} as const;

export type NetworkTypes = keyof typeof NETWORKTYPES;

export const getSearchOptions = (): SearchOptionEnum[] => {
  return Object.keys(SEARCHOPTIONS).map((v) => v) as SearchOptionEnum[];
};

export const getSearchOptionByIndex = (
  index: number | null,
): SearchOptionEnum | null => {
  const options = getSearchOptions();
  if (index === null || index > options.length - 1) return null;

  return getSearchOptions()[index] as SearchOptionEnum;
};

const SEACHOPTIONTITLES: Record<SearchOptionEnum, string> = {
  [SEARCHOPTIONS.ACCOUNT]: 'Account',
  [SEARCHOPTIONS.REQUESTKEY]: 'RequestKey',
  [SEARCHOPTIONS.BLOCKHASH]: 'Block Hash',
  [SEARCHOPTIONS.BLOCKHEIGHT]: 'Height',
  [SEARCHOPTIONS.EVENT]: 'Event',
};

export const getSearchOptionTitle = (searchOption: SearchOptionEnum): string =>
  SEACHOPTIONTITLES[searchOption];
