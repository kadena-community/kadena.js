export enum SearchOptionEnum {
  ACCOUNT,
  REQUESTKEY,
  BLOCKHASH,
  BLOCKHEIGHT,
  EVENT,
}

const SEACHOPTIONTITLES: Record<SearchOptionEnum, string> = {
  [SearchOptionEnum.ACCOUNT]: 'Account',
  [SearchOptionEnum.REQUESTKEY]: 'RequestKey',
  [SearchOptionEnum.BLOCKHASH]: 'Block Hash',
  [SearchOptionEnum.BLOCKHEIGHT]: 'Height',
  [SearchOptionEnum.EVENT]: 'Event',
};

export const getSearchOptions = (): number[] => {
  return Object.keys(SearchOptionEnum)
    .filter((v: string) => !isNaN(Number(v)))
    .map((v) => parseInt(v));
};

export const getSearchOptionTitle = (searchOption: SearchOptionEnum): string =>
  SEACHOPTIONTITLES[searchOption];
