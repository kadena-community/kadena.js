'use client';

import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useTestRunVersion } from '@/hooks/getTestRunVersion';
import { useRunTestVersion } from '@/hooks/runTestVersion';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { use, useEffect } from 'react';

const Home = ({
  params,
}: {
  params: Promise<{ appId: string; testId: string; runId: string }>;
}) => {
  const { appId, testId, runId } = use(params);
  const { mutate, isSuccess, error, isPending } = useRunTestVersion();
  const { data, refetch, isLoading } = useTestRunVersion({
    versionId: testId,
    runId,
  });

  useEffect(() => {
    if (data?.id || isLoading) return;
    mutate({ appId, testId, runId });
  }, [data, isLoading]);

  useEffect(() => {
    if (isSuccess) {
      console.log('refetching');
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      refetch();
    }
  }, [isSuccess]);

  console.log({ error });

  if (isPending) return <div>Running test...</div>;

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem href={`/apps/${appId}`}>
          app
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href={`/apps/${appId}/tests/${testId}`}>
          test
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem
          href={`/apps/${appId}/tests/${testId}/runs/${runId}`}
        >
          {data?.start_time
            ? new Date(data.start_time).toLocaleString()
            : '...'}
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default Home;
