'use client';

import { TestForm } from '@/components/TestForm/TestForm';
import { use } from 'react';

const Home = ({
  params,
}: {
  params: Promise<{ appId: string; testId: string }>;
}) => {
  const { appId, testId } = use(params);

  return (
    <>
      <TestForm appId={appId} testId={testId} />
    </>
  );
};

export default Home;
