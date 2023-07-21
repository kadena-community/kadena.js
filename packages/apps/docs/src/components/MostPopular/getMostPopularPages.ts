import { IMostPopularPage } from '@/types/MostPopularData';

interface IHookResult {
  data: IMostPopularPage[];
}

export const getMostPopularPages = async (slug = '/'): Promise<IHookResult> => {
  async function fetchMostPopularPages(): Promise<IMostPopularPage[]> {
    const res = await fetch(`/api/mostPopular?slug=${slug}`);
    const data = await res.json();
    return data;
  }

  const data = await fetchMostPopularPages();

  return {
    data,
  };
};
