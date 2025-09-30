import { useTestRuns } from '@/hooks/getTestRuns';
import { Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect } from 'react';

interface IProps {
  testId: string;
  hasNewData: boolean;
}

export const TestRuns: FC<IProps> = ({ testId, hasNewData }) => {
  const { data: runs, isLoading, error, refetch } = useTestRuns(testId);

  useEffect(() => {
    if (!hasNewData) return;
    refetch();
  }, [hasNewData]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Stack flexDirection="column">
      <Heading variant="h4">Test Runs</Heading>
      <ul>
        {runs?.map((run) => (
          <li key={run.id}>
            <div>Run ID: {run.id}</div>
            <div>Start Time: {new Date(run.start_time).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </Stack>
  );
};
