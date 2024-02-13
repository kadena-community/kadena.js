import { Share } from '@/features/Share/Share';
import { getTwitterCreator } from '@/utils/getTwitterCreator';
import { getProofOfUs } from '@/utils/proofOfUs';
import type { Metadata } from 'next';

import type { FC } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

export const generateMetadata = async ({
  params,
}: IProps): Promise<Metadata> => {
  const data = await getProofOfUs(params.id);
  return {
    title: `${data.name ?? 'Welcome'} | Immutable Record`,
    description: `${data.name} was a great event`,
    twitter: {
      card: 'summary',
      title: `${data.name ?? 'Welcome'} | Immutable Record`,
      creator: '@straatemans',
    },
    openGraph: {
      images: [
        {
          url: `${data.image}`,
          alt: getTwitterCreator(data.properties.signees),
        },
      ],
    },
  };
};

const Page: FC<IProps> = () => {
  return <Share />;
};

export default Page;
