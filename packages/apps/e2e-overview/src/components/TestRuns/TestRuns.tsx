import { useTestRuns } from '@/hooks/getTestRuns';
import { Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';

interface IProps {
  appId: string;
  testId: string;
}

export const TestRuns: FC<IProps> = ({ appId, testId }) => {
  const { data: runs, isLoading, error } = useTestRuns(testId);
  console.log({ appId, testId, runs });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Stack>
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
