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

export const checkLoading = (...attrs: boolean[]): boolean => {
  return attrs.find((v: boolean) => v === false) ?? false;
};

export const isSearchRequested = (
  searchOption: SearchOptionEnum | null,
  requestedSearchOption: SearchOptionEnum,
): boolean => requestedSearchOption === searchOption;

export const returnSearchQuery = (
  searchQuery: string,
  searchOption: SearchOptionEnum | null,
  requestedSearchOption: SearchOptionEnum,
): string => {
  if (isSearchRequested(searchOption, requestedSearchOption))
    return searchQuery ?? '';

  return '';
};
