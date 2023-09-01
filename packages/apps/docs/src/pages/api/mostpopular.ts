import getMostPopularPages from '@/utils/getMostPopularPages';
import { type NextApiRequest, type NextApiResponse } from 'next';

interface IMostPopularQuery {
  slug?: string;
  limit?: string;
}

type ApiRequestWithoutQuery = Omit<NextApiRequest, 'query'>;
interface IMostPopularPagesRequest extends ApiRequestWithoutQuery {
  query: IMostPopularQuery;
}

const mostPopular = async (
  req: IMostPopularPagesRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {
    query: { slug = '/', limit = '5' },
  } = req;

  const limitNumber = parseInt(limit, 10);

  const mostPopularPages = await getMostPopularPages(slug, limitNumber);
  res.status(200).json(mostPopularPages);
};

export default mostPopular;
