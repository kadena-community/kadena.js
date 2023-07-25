import { menuData } from '@/data/menu.mjs';
import { IMenuData } from '@/types/Layout';
import { NextApiRequest, NextApiResponse } from 'next';

const STARTBRANCH = '/docs/blogchain';

const search = async (
  req: NextApiRequest,
  res: NextApiResponse<IMenuData | IResponseError>,
): Promise<void> => {
  const startBranch = menuData.find(
    (item) => item.root === STARTBRANCH,
  ) as IMenuData;

  if (startBranch === undefined) {
    res.status(404).json({
      status: 404,
      message: 'No posts found',
    });
    res.end();
  }

  res.status(200).json(startBranch);
  res.end();
};

export default search;
