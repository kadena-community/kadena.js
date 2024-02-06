'use client';

import { ScanEvent } from '@/features/ScanEvent/ScanEvent';
import { useGetEventToken } from '@/hooks/data/getEventToken';

import type { FC } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = () => {
  const { data, isLoading, error } = useGetEventToken();

  if (!data) return null;

  return (
    <div>
      {isLoading && <div>...is loading</div>}
      {error && <div>...error</div>}
      <ScanEvent token={data} />
    </div>
  );
};

export default Page;
