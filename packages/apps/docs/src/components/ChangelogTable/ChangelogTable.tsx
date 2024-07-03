import { Stack } from '@kadena/kode-ui';
import { isAfter } from 'date-fns';

import type { FC } from 'react';
import React, { useMemo } from 'react';
import { Row } from './Row';
import { tableClass } from './styles.css';

interface IProps {
  changelogs: IChangelogPackage[];
}

export const ChangelogTable: FC<IProps> = ({ changelogs }) => {
  const reOrderedChangelog = useMemo(() => {
    return changelogs
      .filter((pkg) => pkg.content)
      .sort((a, b) => {
        if (
          isAfter(
            new Date(a.content[0].date ?? 0),
            new Date(b.content[0].date ?? 0),
          )
        )
          return -1;
        if (
          isAfter(
            new Date(b.content[0].date ?? 0),
            new Date(a.content[0].date ?? 0),
          )
        )
          return 1;
        return 0;
      });
  }, [changelogs]);

  return (
    <Stack flexDirection="column" className={tableClass}>
      {reOrderedChangelog.map((pkg) => {
        return <Row pkg={pkg} key={pkg.slug} />;
      })}
    </Stack>
  );
};
