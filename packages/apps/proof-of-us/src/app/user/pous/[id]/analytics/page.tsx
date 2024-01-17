'use client';

import { usePou } from '@/hooks/pou';

import type { FC } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = () => {
  const { data } = usePou();

  if (!data) return null;

  return (
    <div>
      <h2>Analytics</h2>
      pou with ID ({data.id})
    </div>
  );
};

export default Page;
