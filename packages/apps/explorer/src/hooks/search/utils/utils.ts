export enum SearchOptionEnum {
  ACCOUNT,
  REQUESTKEY,
  BLOCKHASH,
  BLOCKHEIGHT,
  EVENT,
}

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
