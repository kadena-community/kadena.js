import { useCallback, useEffect, useState } from 'react';

interface ISemanticSearch {
  isLoading: boolean;
  results: ISearchResult[];
  error?: string;
  handleSubmit: (value: string) => void;
}

const searchErrorMessage =
  'There was a problem. Sorry for the inconvenience. Please try again!';

export const useSemanticSearch = (): ISemanticSearch => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [results, setResults] = useState<ISearchResult[]>([]);
  const [query, setQuery] = useState<string | undefined>();

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

  const handleSubmit = useCallback(
    async (value: string): Promise<void> => {
      if (value === undefined || query === value) return;
      setError(undefined);
      setIsLoading(true);
      setQuery(value);
      await getSearchResults(value);
    },
    [setError, setIsLoading, setQuery, query],
  );

  return {
    isLoading,
    results,
    error,
    handleSubmit,
  };
};
