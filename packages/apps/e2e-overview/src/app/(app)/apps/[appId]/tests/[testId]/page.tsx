'use client';

import { TestVersionForm } from '@/components/TestForm/TestVersionForm';
import { use } from 'react';

const Home = ({
  params,
}: {
  params: Promise<{ appId: string; testId: string }>;
}) => {
  const { appId, testId } = use(params);

  return (
    <>
      <TestVersionForm appId={appId} testId={testId} />
    </>
  );
};

export default Home;
