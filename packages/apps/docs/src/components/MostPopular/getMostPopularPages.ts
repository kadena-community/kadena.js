import { IMostPopularPage } from '@/types/MostPopularData';

interface IGetMostPopularPagesResult {
  data: IMostPopularPage[];
}

export const getMostPopularPages = async (
  slug = '/',
): Promise<IGetMostPopularPagesResult> => {
  async function fetchMostPopularPages(): Promise<IMostPopularPage[]> {
    const res = await fetch(
      `http://localhost:3000/api/mostpopular?slug=${slug}`,
    );
    const data = await res.json();
    console.log({
      data,
    });
    return data;
  }

  const data = await fetchMostPopularPages();

  return {
    data,
  };
};
