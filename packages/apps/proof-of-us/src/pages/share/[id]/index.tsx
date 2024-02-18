import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import { Share } from '@/features/Share/Share';

import type { FC } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = () => {
  return (
    <ProofOfUsProvider>
      <Share />;
    </ProofOfUsProvider>
  );
};

export default Page;
