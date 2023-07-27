import { IMostPopularPage } from '@/types/MostPopularData';

interface IGetMostPopularPagesResult {
  data: IMostPopularPage[];
}

export const getMostPopularPages = async (
  slug = '/',
): Promise<IGetMostPopularPagesResult> => {
  async function fetchMostPopularPages(): Promise<IMostPopularPage[]> {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
    const res = await fetch(`${BASE_URL}/mostpopular?slug=${slug}`);
    const data = await res.json();
    return data;
  }

  const data = await fetchMostPopularPages();

  return {
    data,
  };
};
