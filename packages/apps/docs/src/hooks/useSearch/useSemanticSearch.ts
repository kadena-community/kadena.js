import { useEffect, useState } from 'react';

interface ISemanticSearch {
  isLoading: boolean;
  results: ISearchResult[];
  error?: string;
}

const searchErrorMessage =
  'There was a problem. Sorry for the inconvenience. Please try again!';

export const useSemanticSearch = (query?: string): ISemanticSearch => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [results, setResults] = useState<ISearchResult[]>([]);

  const getSearchResults = async (query: string): Promise<void> => {
    try {
      const response = await fetch(`/api/semanticsearch?query=${query}`);

      const data = await response.json();

      if (data.status !== undefined && data.status >= 400) {
        setError(searchErrorMessage);
        setResults([]);
        return;
      }

      setError(undefined);
      setResults(data);
    } catch (e) {
      setError(searchErrorMessage);
      setResults([]);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [results]);

  useEffect(() => {
    setError(undefined);
    if (query !== undefined) {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getSearchResults(query);
    }
  }, [query]);

  return {
    isLoading,
    results,
    error,
  };
};
