import { useActivateAppTestVersion } from '@/hooks/activateAppTestVersion';
import { useAllAppTestVersions } from '@/hooks/getAllAppTestVersions';
import { Button, Stack, Link as UILink } from '@kadena/kode-ui';
import Link from 'next/link';
import type { FC } from 'react';

interface IProps {
  appId: string;
}

export const AllAppTestVersions: FC<IProps> = ({ appId }) => {
  const { data, isLoading, error, refetch } = useAllAppTestVersions({ appId });
  const { mutate: activateVersion } = useActivateAppTestVersion(appId);

  const handleActivate = async (versionId: string) => {
    await activateVersion(versionId, {
      onSuccess: async () => {
        await refetch();
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <Stack flexDirection="column">
      <ul>
        {data?.map((version) => (
          <li key={version.id}>
            <Stack justifyContent="space-between">
              <UILink
                component={Link}
                href={`/apps/${appId}/tests/${version.id}`}
              >
                {version.version}
              </UILink>

              <div>{version.isactive.toString()}</div>

              <Button
                variant="outlined"
                isCompact
                isDisabled={version.isactive}
                onClick={() => handleActivate(version.id)}
              >
                Set to active
              </Button>
            </Stack>
          </li>
        ))}
      </ul>

      <UILink
        variant="primary"
        href={`/apps/${appId}/tests/new`}
        component={Link}
      >
        New
      </UILink>
    </Stack>
  );
};
