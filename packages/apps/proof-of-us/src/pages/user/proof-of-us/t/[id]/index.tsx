import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import { Share } from '@/features/Share/Share';

import type { FC } from 'react';

const Page: FC = () => {
  return (
    <ProofOfUsProvider>
      <Share />
    </ProofOfUsProvider>
  );
};

export default Page;
