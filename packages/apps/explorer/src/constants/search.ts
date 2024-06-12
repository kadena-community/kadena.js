import type { ISearchItem } from '@/components/search/search-component/search-component';

export const getSearchData = (): {
  searchItems: ISearchItem[];
  placeholder: string;
} => {
  const searchItems: ISearchItem[] = [
    { title: 'Account' },
    { title: 'Request Key' },
    { title: 'Block Height' },
    { title: 'Block Hash' },
    { title: 'Events' },
  ];
  const placeholder = 'Search the Kadena Blockchain on';

  return { searchItems, placeholder };
};
