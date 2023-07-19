import { useEffect } from 'react';

export const useFetchMostPopularPages = (): void => {
  const abortController = new AbortController();

  async function fetchMostPopularPages(): Promise<void> {
    const res = await fetch('/api/mostPopular');
    const data = await res.json();
    console.log(data);
    return data;
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchMostPopularPages();

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
