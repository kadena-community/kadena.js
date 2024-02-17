import ProofOfUsAdminLayout from '@/components/ProofOfUsAdminLayout/ProofOfUsAdminLayout';
import { Share } from '@/features/Share/Share';

import type { FC } from 'react';

const Page: FC = () => {
  return (
    <ProofOfUsAdminLayout>
      <Share />
    </ProofOfUsAdminLayout>
  );
};

export default Page;
