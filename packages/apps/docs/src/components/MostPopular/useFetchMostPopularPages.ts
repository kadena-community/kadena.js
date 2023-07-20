import { IMostPopularPage } from '@/types/MostPopularData';
import { useEffect, useState } from 'react';

interface IHookResult {
  data: IMostPopularPage[];
}

export const useFetchMostPopularPages = (slug = '/'): IHookResult => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchMostPopularPages(): Promise<void> {
      const res = await fetch(`/api/mostPopular?slug=${slug}`);
      const data = await res.json();
      setData(data);
    }
    fetchMostPopularPages().catch((err) => {
      console.error(err);
    });

    return () => {
      abortController.abort();
    };
  }, [slug]);

  return {
    data,
  };
};
