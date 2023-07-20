import { useEffect, useState } from 'react';

interface ISemanticSearch {
  isLoading: boolean;
  results: ISearchResult[];
}

export const useSemanticSearch = (query?: string): ISemanticSearch => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean | undefined>(false);
  const [results, setResults] = useState<ISearchResult[]>([]);

  const getSearchResults = async (query: string): Promise<void> => {
    const response = await fetch(`/api/semanticsearch?query=${query}`);

    const data = await response.json();

    if (data.status !== undefined && data.status >= 400) {
      setError(error);
      setResults([]);
      return;
    }

    setError(undefined);
    setResults(data);
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
