'use client';

import { useGetEventToken } from '@/hooks/data/getEventToken';

import type { FC } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = ({ params }) => {
  const { data, isLoading, error } = useGetEventToken(params.id);

  return (
    <div>
      {isLoading && <div>...is loading</div>}
      {error && <div>...error</div>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Page;
