import { SearchItem } from '@/components/search/search';

export const getSearchData = () => {
  const searchItems: SearchItem[] = [
    { title: 'Account' },
    { title: 'Request Key' },
    { title: 'Block Height' },
    { title: 'Block Hash' },
    { title: 'Events' },
  ];
  const placeholder = 'Search the Kadena Blockchain on';

  return { searchItems, placeholder };
};
