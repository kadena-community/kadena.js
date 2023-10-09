import { menuData } from '@/_generated/menu.mjs';
import { getInitBlogPosts } from '@/hooks/useGetBlogs/utils';
import type { IMenuData } from '@/Layout';
import type { IResponseError } from '@/types';
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

  const data = getInitBlogPosts(menuData as IMenuData[], offset, limit, {
    authorId,
    year,
    tagId,
  });

  res.json(data);
};

export default search;
