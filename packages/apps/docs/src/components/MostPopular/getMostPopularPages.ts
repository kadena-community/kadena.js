import type { IMostPopularPage } from '@/types/MostPopularData';

interface IGetMostPopularPagesResult {
  data: IMostPopularPage[];
}

export const getMostPopularPages = async (
  slug = '/',
): Promise<IGetMostPopularPagesResult> => {
  async function fetchMostPopularPages(): Promise<IMostPopularPage[]> {
    const res = await fetch(`api/mostpopular?slug=${slug}`);
    const data = await res.json();
    return data;
  }

  const data = await fetchMostPopularPages();

  return {
    data,
  };
};
