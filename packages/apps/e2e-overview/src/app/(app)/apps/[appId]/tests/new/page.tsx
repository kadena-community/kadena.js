'use client';
import { TestForm } from '@/components/TestForm/TestForm';
import type { AppTest } from '@/hooks/getAllAppTests';
import { useRouter } from 'next/navigation';
import { use } from 'react';

const Home = ({
  params,
}: {
  params: Promise<{ appId: string; testId: string }>;
}) => {
  const { appId, testId } = use(params);
  const router = useRouter();

  const handleSuccess = (data: AppTest) => {
    if (data.id) {
      router.push(`/apps/${appId}/tests/${data.id}`);
    }
  };

  return (
    <>
      <TestForm appId={appId} testId={testId} onSuccess={handleSuccess} />
    </>
  );
};

export default Home;
