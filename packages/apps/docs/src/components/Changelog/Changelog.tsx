import { getPackages } from '@/scripts/importChangelogs/utils/misc';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { Package } from './Package';

interface IProps {
  changelogs: IChangelogComplete;
}

export const Changelog: FC<IProps> = ({ changelogs }) => {
  const packages = useMemo(() => {
    return getPackages(changelogs);
  }, [changelogs]);

  return (
    <Stack flexDirection="column" gap="xxxl">
      {packages.map((pkg) => (
        <Package key={pkg.repoName} pkg={pkg} isFullPage={false} />
      ))}
    </Stack>
  );
};
