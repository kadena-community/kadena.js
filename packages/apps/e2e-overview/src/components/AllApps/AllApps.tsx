import { useAllApps } from '@/hooks/getAllApps';
import { MonoAdd } from '@kadena/kode-icons';
import { Link as UILink } from '@kadena/kode-ui';
import Link from 'next/link';

export const AllApps = () => {
  const { data, isLoading, error } = useAllApps();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <>
      <ul>
        {data?.map((app) => (
          <li key={app.id}>
            <UILink component={Link} href={`/apps/${app.id}`}>
              {app.name}
            </UILink>
          </li>
        ))}
      </ul>
      <UILink
        component={Link}
        variant="primary"
        href={`/apps/new`}
        startVisual={<MonoAdd />}
      >
        Add App
      </UILink>
    </>
  );
};
