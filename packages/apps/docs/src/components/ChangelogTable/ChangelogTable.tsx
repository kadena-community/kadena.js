import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from '@kadena/react-ui';
import { isAfter } from 'date-fns';
import type { FC } from 'react';
import React, { useMemo } from 'react';

interface IProps {
  changelogs: IChangelogPackage[];
}

export const ChangelogTable: FC<IProps> = ({ changelogs }) => {
  console.log(changelogs);
  const reOrderedChangelog = useMemo(() => {
    return changelogs.sort((a, b) => {
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
    <Table isCompact={false}>
      <TableHeader>
        <Column />
        <Column />
      </TableHeader>
      <TableBody>
        {reOrderedChangelog.map((pkg) => (
          <Row key={pkg.slug}>
            <Cell>{pkg.name}</Cell>
            <Cell>{pkg.content[0].date}</Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};
