'use client';
import { useSubmit } from '@/hooks/submit';
import type { FC } from 'react';

interface IProps {
  searchParams: ISearchParams;
}

const Page: FC<IProps> = ({ searchParams }) => {
  const { result, isLoading } = useSubmit(searchParams);
  return (
    <div>
      app router
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};

export default Page;
