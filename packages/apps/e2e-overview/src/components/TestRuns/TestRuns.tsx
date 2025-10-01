import { useTestRuns } from '@/hooks/getTestRuns';
import { Heading, Stack, Link as UILink } from '@kadena/kode-ui';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';

interface IProps {
  appId: string;
  testId: string;
}

export const TestRuns: FC<IProps> = ({ appId, testId }) => {
  const { data: runs, isLoading, error } = useTestRuns(testId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Stack flexDirection="column">
      <Heading variant="h4">Test Runs</Heading>
      <ul>
        {runs?.map((run) => (
          <li key={run.id}>
            <UILink
              component={Link}
              href={`/apps/${appId}/tests/${testId}/runs/${run.id}`}
            >
              {`Run ID: ${run.id}`}
            </UILink>
            <div>Start Time: {new Date(run.start_time).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </Stack>
  );
};
