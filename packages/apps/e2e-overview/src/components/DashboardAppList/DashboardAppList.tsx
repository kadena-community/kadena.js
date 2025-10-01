import { useAllApps } from '@/hooks/getAllApps';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';

export const DashboardAppList: FC = () => {
  const { data, isLoading, error } = useAllApps({
    dashboard: true,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Stack>
      <ul>{data?.map((app) => <li key={app.id}>{app.name}</li>)}</ul>
    </Stack>
  );
};
