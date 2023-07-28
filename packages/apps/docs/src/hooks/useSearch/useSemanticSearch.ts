import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

interface ISemanticSearch {
  isLoading: boolean;
  results: ISearchResult[];
  error?: string;
  handleSubmit: (value: string) => void;
}

const searchErrorMessage =
  'There was a problem. Sorry for the inconvenience. Please try again!';

export const useSemanticSearch = (
  limitResults: number = 50,
): ISemanticSearch => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [results, setResults] = useState<ISearchResult[]>([]);
  const [query, setQuery] = useState<string | undefined>();
  const router = useRouter();

  const getSearchResults = async (query: string): Promise<void> => {
    try {
      const response = await fetch(
        `/api/semanticsearch?query=${query}&limit=${limitResults}`,
      );

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

      await router.push(`${router.route}?q=${value}`);

      await getSearchResults(value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setError, setIsLoading, setQuery, query],
  );

  return {
    isLoading,
    results,
    error,
    handleSubmit,
  };
};
