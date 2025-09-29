'use client';
import { TestVersionForm } from '@/components/TestForm/TestVersionForm';
import type { AppTestVersion } from '@/hooks/getAllAppTestVersions';

import { useRouter } from 'next/navigation';
import { use } from 'react';

const Home = ({
  params,
}: {
  params: Promise<{ appId: string; testId: string }>;
}) => {
  const { appId, testId } = use(params);
  const router = useRouter();

  const handleSuccess = (data: AppTestVersion) => {
    if (data.id) {
      router.push(`/apps/${appId}/tests/${data.id}`);
    }
  };

  return (
    <>
      <TestVersionForm
        appId={appId}
        testId={testId}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default Home;
