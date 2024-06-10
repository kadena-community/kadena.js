import { useAccountQuery } from '@/__generated__/sdk';
import { getSearchData } from '@/constants/search';
import { useEffect, useState } from 'react';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { loading, data, error } = useAccountQuery({
    variables: {
      accountName: searchQuery ?? '',
    },
  });

  console.log(data);

  useEffect(() => {
    // setSearchQuery(
    //   'k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
    // );
    if (!searchQuery) return;
  }, [searchQuery]);

  return { setSearchQuery, data, searchQuery };
};
