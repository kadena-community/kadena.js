import { useAccountQuery } from '@/__generated__/sdk';
import { useState } from 'react';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { loading, data, error } = useAccountQuery({
    variables: {
      accountName: searchQuery ?? '',
    },
  });

  console.log(data);

  return { setSearchQuery, data, searchQuery, loading, error };
};
