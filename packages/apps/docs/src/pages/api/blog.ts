import menuData from '@/_generated/menu.json';
import { getInitBlogPosts } from '@/hooks/useGetBlogs/utils';
import type { IResponseError } from '@/types';
import type { IMenuData } from '@kadena/docs-tools';
import type { NextApiRequest, NextApiResponse } from 'next';

const search = async (
  req: NextApiRequest,
  res: NextApiResponse<IMenuData[] | IResponseError>,
): Promise<void> => {
  const {
    limit = 10,
    offset = 0,
    authorId,
    year,
    tagId,
  } = req.query as unknown as {
    limit: number;
    offset: number;
    authorId?: string;
    year?: string;
    tagId?: string;
  };

  const data = getInitBlogPosts(
    menuData as unknown as IMenuData[],
    offset,
    limit,
    {
      authorId,
      year,
      tagId,
    },
  );

  res.json(data);
};

export default search;
