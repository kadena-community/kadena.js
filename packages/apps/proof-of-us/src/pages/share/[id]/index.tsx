import { Share } from '@/features/Share/Share';

import type { FC } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = () => {
  return <Share />;
};

export default Page;
