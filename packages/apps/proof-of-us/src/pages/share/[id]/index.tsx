import { Share } from '@/features/Share/Share';
import { fetchManifestData } from '@/utils/fetchManifestData';
import { getTwitterCreator } from '@/utils/getTwitterCreator';
import { getProofOfUs } from '@/utils/proofOfUs';
import type { Metadata } from 'next';

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
