import type { ISearchItem } from '@/components/search/search';

export const getSearchData = (): {
  searchItems: ISearchItem[];
} => {
  const searchItems: ISearchItem[] = [
    { title: 'Account' },
    { title: 'Request Key' },
    { title: 'Block Height' },
    { title: 'Block Hash' },
    { title: 'Events' },
  ];

  return { searchItems };
};
