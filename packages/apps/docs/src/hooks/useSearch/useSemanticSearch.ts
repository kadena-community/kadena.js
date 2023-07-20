import { useEffect, useState } from 'react';

interface ISemanticSearch {
  isLoading: boolean;
  results: ISearchResult[];
}

export const useSemanticSearch = (query?: string): ISemanticSearch => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ISearchResult[]>([]);

  const getSearchResults = async (query: string): Promise<void> => {
    const data = await fetch('/api/semanticsearch', {
      method: 'POST',
      body: JSON.stringify({
        query,
      }),
    });

    const json = await data.json();
    setResults(json);
  };

  useEffect(() => {
    setIsLoading(false);
  }, [results]);

  useEffect(() => {
    if (query !== undefined) {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getSearchResults(query);
    }
  }, [query]);

  return {
    isLoading,
    results,
  };
};
