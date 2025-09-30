'use client';

import { TestVersionForm } from '@/components/TestForm/TestVersionForm';
import { TestRuns } from '@/components/TestRuns/TestRuns';
import type { AppTestVersion } from '@/hooks/getAllAppTestVersions';
import { useRunTestVersion } from '@/hooks/runTestVersion';
import { Button } from '@kadena/kode-ui';
import { useRouter } from 'next/navigation';
import { use } from 'react';

const Home = ({
  params,
}: {
  params: Promise<{ appId: string; testId: string }>;
}) => {
  const { appId, testId } = use(params);
  const router = useRouter();
  const isNew = testId === 'new';
  const { mutate, isSuccess } = useRunTestVersion();

  const handleSuccess = (data: AppTestVersion) => {
    if (data.id) {
      router.push(`/apps/${appId}/tests/${data.id}`);
    }
  };

  const handleTest = async () => {
    // Call your API to run the tests
    await mutate({ appId, testId });
  };

  return (
    <>
      <TestVersionForm
        appId={appId}
        testId={testId}
        onSuccess={handleSuccess}
      />

      {!isNew && (
        <>
          <Button onClick={handleTest}>Run tests manually</Button>
          <TestRuns testId={testId} hasNewData={isSuccess} />
        </>
      )}
    </>
  );
};

export default Home;
