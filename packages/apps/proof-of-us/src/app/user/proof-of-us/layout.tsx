'use client';

import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import type { FC, PropsWithChildren } from 'react';

const UserLayout: FC<PropsWithChildren> = ({ children }) => {
  return <ProofOfUsProvider>{children}</ProofOfUsProvider>;
};

export default UserLayout;
